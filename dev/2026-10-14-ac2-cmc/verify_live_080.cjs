/* v0.8.0 live 驗證：對 https://eaty.pages.dev/ 跑。
 *
 * 注意：Supabase 的 SQL 未入庫之前，CMC Cafe／拾味／檔口下單連結**不會出現**。
 * 所以本腳本分兩部分：
 *   A. 一定要通過（前端改動本身，唔靠新資料）
 *   B. 有就跑、冇就報「未入庫」（唔算失敗）
 * 入庫之後再跑一次，B 部分就會全部出現。
 */
const { chromium } = require('playwright-core');

const LIVE = 'https://eaty.pages.dev/';
const EXPECT_VERSION = '0.8.0';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
    headless: true,
  });
  const report = [];
  for (const vp of [{ name: 'desk', width: 1440, height: 1000 }, { name: 'mob', width: 390, height: 844 }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));

    await page.goto(LIVE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    const r = { vp: vp.name };
    r.version = await page.evaluate(() => window.CITYU_EATS_CONFIG.VERSION);
    r.source = await page.evaluate(() => window.CityuEatsMenu.source);
    r.heading = (await page.locator('#canteens .section-title').innerText()).trim();
    r.nav = (await page.locator('.site-nav').innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
    r.heroNote = (await page.locator('.hero-note').innerText().catch(() => '')).trim();
    r.cards = await page.$$eval('.canteen-card-name h3', (e) => e.map((x) => x.innerText.trim()));
    r.totalDishes = await page.evaluate(() => window.CITYU_EATS_DATA.dishes.length);
    r.usedCats = await page.evaluate(() => new Set(window.CITYU_EATS_DATA.dishes.map((d) => d.cat)).size);
    r.overflowHome = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    r.hasCmc = r.cards.some((c) => /CMC/i.test(c));
    r.hasThePick = await page.evaluate(() => window.CITYU_EATS_DATA.categories.some((c) => c.id === '拾味 The Pick'));
    r.stallOrderUrls = await page.evaluate(() =>
      window.CITYU_EATS_DATA.categories.filter((c) => c.orderUrl).map((c) => ({ id: c.id, url: c.orderUrl })));

    await page.goto(LIVE + '#/canteen/ac2', { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    r.ac2Chips = await page.$$eval('#chip-strip .chip', (e) => e.map((x) => x.innerText.replace(/\s+/g, ' ').trim()));
    r.ac2HeadOrders = await page.$$eval('.cat-head-order', (e) => e.map((x) => x.href));
    r.overflowAc2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

    if (r.hasCmc) {
      await page.goto(LIVE + '#/canteen/cmc', { waitUntil: 'networkidle' });
      await page.waitForTimeout(900);
      r.cmcName = (await page.locator('.canteen-name').innerText()).trim();
      r.cmcDishes = await page.$$eval('.dish-card', (e) => e.length);
      r.cmcMealTabs = await page.$$eval('.meal-tab', (e) => e.map((x) => x.innerText.trim()));
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((x) => setTimeout(x, 60)); }
      });
      await page.waitForTimeout(800);
      r.cmcBroken = await page.evaluate(() => [...document.querySelectorAll('.dish-card img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
      r.overflowCmc = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      await page.goto(LIVE + '#/canteen/cmc', { waitUntil: 'networkidle' });
      await page.waitForTimeout(700);
      await page.screenshot({ path: `dev/2026-10-14-ac2-cmc/LIVE-080-cmc-${vp.name}.png` });
    }
    r.errCount = errs.length;
    r.errs = errs.slice(0, 5);
    report.push(r);
    await ctx.close();
  }
  await browser.close();
  console.log(JSON.stringify(report, null, 2));
})();
