/* v0.8.0 本地驗證：AC2 兩個檔口下單連結 ＋ 拾味 ＋ 新食堂 CMC Cafe
 *
 * 做法：本機靜態伺服器起網站，Playwright 攔截 Supabase REST 回應，
 * 把 supabase/ac2-stalls-cmc-2026-10-14.sql 的內容疊加落去（fixture.json 由
 * sql_to_fixture.py 由 SQL 直接解析出來）。咁就可以喺 SQL 未入庫前驗 UI。
 *
 * 用法：node dev/2026-10-14-ac2-cmc/verify_local.cjs <port>
 */
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.argv[2] || 8765);
const BASE = `http://127.0.0.1:${PORT}/`;
const OUT = path.join(__dirname);
const FIX = JSON.parse(fs.readFileSync(path.join(OUT, 'fixture.json'), 'utf8'));

const tagsArr = (t) => (Array.isArray(t) ? t : (t === '{}' || !t ? [] : String(t).replace(/[{}]/g, '').split(',').filter(Boolean)));

function overlay(kind, rows) {
  if (!Array.isArray(rows)) return rows;
  if (kind === 'canteens') {
    return rows.filter((r) => !FIX.canteens.some((n) => n.id === r.id))
      .concat(FIX.canteens.map((c) => ({ ...c })));
  }
  if (kind === 'categories') {
    const merged = rows
      .filter((r) => !FIX.categories.some((n) => n.id === r.id))
      .map((r) => ({ ...r, order_url: FIX.categoryOrderUrls[r.id] || r.order_url || null }));
    for (const c of FIX.categories) {
      merged.push({ order_url: FIX.categoryOrderUrls[c.id] || null, ...c });
    }
    return merged;
  }
  if (kind === 'dishes') {
    return rows
      .filter((r) => !FIX.dishes.some((n) => n.id === r.id))
      .map((r) => {
        let out = r;
        if (FIX.dishPrices[r.id] != null) out = { ...out, price: FIX.dishPrices[r.id] };
        if (FIX.dishPhotos[r.id]) out = { ...out, photo: FIX.dishPhotos[r.id] };
        return out;
      })
      .concat(FIX.dishes.map((d) => ({
        ...d,
        // SQL 係先 insert（photo=null）再 update set photo=...，所以這裡要補返
        photo: FIX.dishPhotos[d.id] || d.photo,
        tags: tagsArr(d.tags),
      })));
  }
  return rows;
}

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
    headless: true,
  });

  const report = [];

  for (const vp of [
    { name: 'desk', width: 1440, height: 1000 },
    { name: 'mob', width: 390, height: 844 },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: 'reduce',
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));

    await page.route('**/rest/v1/**', async (route) => {
      const url = route.request().url();
      const kind = ['canteens', 'categories', 'dishes', 'roll_blacklist'].find((k) => url.includes('/' + k));
      if (!kind) return route.continue();
      const resp = await route.fetch();
      let body;
      try { body = await resp.json(); } catch { return route.fulfill({ response: resp }); }
      const out = kind === 'roll_blacklist' ? body : overlay(kind, body);
      return route.fulfill({ response: resp, json: out });
    });

    const row = { vp: vp.name, errs };

    // ── 首頁 ──
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    row.source = await page.evaluate(() => window.CityuEatsMenu.source);
    row.version = await page.evaluate(() => window.CITYU_EATS_CONFIG.VERSION);
    row.heading = (await page.locator('#canteens .section-title').innerText()).trim();
    row.cards = await page.$$eval('.canteen-card-name h3', (e) => e.map((x) => x.innerText.trim()));
    row.cardDishCounts = await page.$$eval('.canteen-card-foot .n b', (e) => e.map((x) => Number(x.innerText.trim())));
    row.totalDishes = row.cardDishCounts.reduce((a, b) => a + b, 0);
    row.catCount = await page.evaluate(() => window.CITYU_EATS_DATA.categories.length);
    row.usedCatCount = await page.evaluate(
      () => new Set(window.CITYU_EATS_DATA.dishes.map((d) => d.cat)).size);
    row.dishTotal = await page.evaluate(() => window.CITYU_EATS_DATA.dishes.length);
    row.cardOrderBtns = await page.$$eval('.canteen-card-order', (e) => e.map((x) => x.innerText.trim()));
    row.nav = (await page.locator('.site-nav a[href="#/"] , header').first().innerText().catch(() => '')).trim();
    row.overflowHome = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    row.cmcPhotoOk = await page.evaluate(() => {
      const img = [...document.querySelectorAll('.canteen-card img')].find((i) => i.src.includes('cmc'));
      return img ? img.complete && img.naturalWidth > 0 : null;
    });
    await page.screenshot({ path: path.join(OUT, `080-home-${vp.name}.png`), fullPage: false });

    // ── AC2 頁：檔口下單連結 ＋ 拾味 ──
    await page.goto(BASE + '#/canteen/ac2', { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    row.ac2Chips = await page.$$eval('#chip-strip .chip', (e) => e.map((x) => x.innerText.replace(/\s+/g, ' ').trim()));
    row.ac2HeadOrders = await page.$$eval('.cat-head-order', (e) => e.map((x) => ({ txt: x.innerText.trim(), href: x.href })));
    row.ac2ThePickHead = await page.$$eval('.cat-head', (e) => e.map((x) => x.innerText.replace(/\s+/g, ' ').trim())).then((l) => l.filter((t) => t.includes('拾味')));
    row.overflowAc2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    // 檔口標題列在手機寬度有無撐爆 / 換行正常
    row.ac2HeadOrderBox = await page.locator('.cat-head-order').first().boundingBox().catch(() => null);
    // 滾到底把所有 lazy 圖逼出來，再檢查有無爆圖
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(800);
    row.ac2BrokenImgs = await page.evaluate(() =>
      [...document.querySelectorAll('.dish-card img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));

    // 只看單一分類 → 應該出現獨立橫幅
    await page.locator('#chip-strip .chip', { hasText: '餃餃陣' }).first().click();
    await page.waitForTimeout(500);
    row.ac2Bar = await page.$$eval('.cat-order-bar a', (e) => e.map((x) => ({ txt: x.innerText.trim(), href: x.href })));
    row.overflowAc2Cat = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await page.screenshot({ path: path.join(OUT, `080-ac2-stall-${vp.name}.png`), fullPage: false });
    // 檔口標題列近照（睇下「網上點餐」膠囊有無撐爆／走位）
    await page.goto(BASE + '#/canteen/ac2', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.locator('.cat-group').filter({ hasText: '餃餃陣' }).first()
      .screenshot({ path: path.join(OUT, `080-ac2-stallhead-${vp.name}.png`) })
      .catch(() => {});
    await page.locator('.cat-group').filter({ hasText: '西北麵館' }).first()
      .screenshot({ path: path.join(OUT, `080-ac2-stallhead2-${vp.name}.png`) })
      .catch(() => {});

    // 拾味分類：5 個價位
    await page.goto(BASE + '#/canteen/ac2', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.locator('#chip-strip .chip', { hasText: '拾味' }).first().click();
    await page.waitForTimeout(500);
    row.thePickDishes = await page.$$eval('.dish-card', (e) => e.map((x) => x.innerText.replace(/\s+/g, ' ').trim()).slice(0, 8));
    await page.screenshot({ path: path.join(OUT, `080-ac2-thepick-${vp.name}.png`), fullPage: false });

    // ── CMC 頁 ──
    await page.goto(BASE + '#/canteen/cmc', { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    row.cmcName = (await page.locator('.canteen-name').innerText()).trim();
    row.cmcBldg = (await page.locator('.canteen-bldg').innerText()).trim();
    row.cmcHours = (await page.locator('.canteen-hours').innerText()).trim();
    row.cmcMealTabs = await page.$$eval('.meal-tab', (e) => e.map((x) => x.innerText.trim()));
    row.cmcChips = await page.$$eval('#chip-strip .chip', (e) => e.map((x) => x.innerText.replace(/\s+/g, ' ').trim()));
    row.cmcCats = await page.$$eval('.cat-head', (e) => e.map((x) => x.innerText.replace(/\s+/g, ' ').trim()));
    row.cmcDishCount = await page.$$eval('.dish-card', (e) => e.length);
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(800);
    row.cmcBrokenImgs = await page.evaluate(() =>
      [...document.querySelectorAll('.dish-card img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
    row.overflowCmc = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    // 午餐餐段：應只剩「本週精選／是日推介」
    await page.locator('.meal-tab', { hasText: '午餐' }).first().click();
    await page.waitForTimeout(500);
    row.cmcLunchCats = await page.$$eval('.cat-head', (e) => e.map((x) => x.innerText.replace(/\s+/g, ' ').trim()));
    row.cmcLunchDishCount = await page.$$eval('.dish-card', (e) => e.length);
    await page.screenshot({ path: path.join(OUT, `080-cmc-lunch-${vp.name}.png`), fullPage: false });
    await page.goto(BASE + '#/canteen/cmc', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(OUT, `080-cmc-${vp.name}.png`), fullPage: false });

    row.errCount = errs.length;
    report.push(row);
    await ctx.close();
  }

  await browser.close();
  console.log(JSON.stringify(report, null, 2));
})();
