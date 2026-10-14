/* 只截「檔口標題列」近照：驗證新增的「網上點餐」膠囊有無撐爆／走位。 */
const { chromium } = require('playwright-core');
const path = require('path');

const PORT = Number(process.argv[2] || 8765);
const BASE = `http://127.0.0.1:${PORT}/`;
const OUT = __dirname;
const fs = require('fs');
const FIX = JSON.parse(fs.readFileSync(path.join(OUT, 'fixture.json'), 'utf8'));
const tagsArr = (t) => (Array.isArray(t) ? t : (t === '{}' || !t ? [] : String(t).replace(/[{}]/g, '').split(',').filter(Boolean)));
function overlay(kind, rows) {
  if (!Array.isArray(rows)) return rows;
  if (kind === 'canteens') return rows.filter((r) => !FIX.canteens.some((n) => n.id === r.id)).concat(FIX.canteens.map((c) => ({ ...c })));
  if (kind === 'categories') return rows.filter((r) => !FIX.categories.some((n) => n.id === r.id))
    .map((r) => ({ ...r, order_url: FIX.categoryOrderUrls[r.id] || r.order_url || null }))
    .concat(FIX.categories.map((c) => ({ order_url: FIX.categoryOrderUrls[c.id] || null, ...c })));
  if (kind === 'dishes') return rows.filter((r) => !FIX.dishes.some((n) => n.id === r.id))
    .map((r) => ({ ...r, photo: FIX.dishPhotos[r.id] || r.photo, price: FIX.dishPrices[r.id] != null ? FIX.dishPrices[r.id] : r.price }))
    .concat(FIX.dishes.map((d) => ({ ...d, photo: FIX.dishPhotos[d.id] || d.photo, tags: tagsArr(d.tags) })));
  return rows;
}

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
    headless: true,
  });
  for (const vp of [{ name: 'desk', width: 1440, height: 1000 }, { name: 'mob', width: 390, height: 844 }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.route('**/rest/v1/**', async (route) => {
      const url = route.request().url();
      const kind = ['canteens', 'categories', 'dishes', 'roll_blacklist'].find((k) => url.includes('/' + k));
      if (!kind) return route.continue();
      const resp = await route.fetch();
      let body; try { body = await resp.json(); } catch { return route.fulfill({ response: resp }); }
      return route.fulfill({ response: resp, json: kind === 'roll_blacklist' ? body : overlay(kind, body) });
    });
    await page.goto(BASE + '#/canteen/ac2', { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);

    for (const [slug, needle] of [['dumpling', '餃餃陣'], ['xibei', '西北麵館'], ['thepick', '拾味']]) {
      const handle = await page.evaluateHandle((n) => {
        const groups = [...document.querySelectorAll('.cat-group')];
        return groups.find((g) => g.textContent.includes(n)) || null;
      }, needle);
      const el = handle.asElement();
      if (!el) { console.log(`  no group for ${needle}`); continue; }
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await el.screenshot({ path: path.join(OUT, `080-head-${slug}-${vp.name}.png`) });
      console.log(`  shot head-${slug}-${vp.name}`);
    }
    // 只看單一分類時的獨立橫幅
    await page.goto(BASE + '#/canteen/ac2', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.locator('#chip-strip .chip').filter({ hasText: '餃餃陣' }).first().click();
    await page.waitForTimeout(500);
    const bar = await page.$('.cat-order-bar');
    if (bar) {
      await bar.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      await bar.screenshot({ path: path.join(OUT, `080-bar-${vp.name}.png`) });
      console.log(`  shot bar-${vp.name}`);
    }
    await ctx.close();
  }
  await browser.close();
})();
