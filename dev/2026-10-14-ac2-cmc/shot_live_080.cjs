/* v0.8.0 線上截圖：拍關鍵新 UI（下單膠囊、拾味分類、4 食堂卡）
 * 目的：唔止信斷言，要親眼睇。SQL 入庫後跑。
 */
const { chromium } = require('playwright-core');
const LIVE = 'https://eaty.pages.dev/';
const OUT = 'dev/2026-10-14-ac2-cmc';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
    headless: true,
  });
  const log = [];

  // ── 桌面 ──
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();

  // 1. 首頁 4 張食堂卡
  await page.goto(LIVE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.locator('#canteens').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/LIVE-080-home-cards-desk.png` });
  log.push('home-cards-desk');

  // 2. AC2 餃餃陣／西北麵館 分類標題列的下單膠囊
  await page.goto(LIVE + '#/canteen/ac2', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const pills = await page.$$('.cat-head-order');
  log.push('cat-head-order pills: ' + pills.length);
  if (pills.length) {
    await pills[0].scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/LIVE-080-ac2-order-pill-desk.png` });
    log.push('ac2-order-pill-desk');
  }

  // 3. 單獨選「餃餃陣」→ .cat-order-bar 橫幅
  await page.goto(LIVE + '#/canteen/ac2?cat=' + encodeURIComponent('餃餃陣'), { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const bar = await page.$('.cat-order-bar');
  log.push('cat-order-bar present: ' + !!bar);
  await page.screenshot({ path: `${OUT}/LIVE-080-ac2-order-bar-desk.png` });
  log.push('ac2-order-bar-desk');

  // 4. 拾味 The Pick 分類
  await page.goto(LIVE + '#/canteen/ac2?cat=' + encodeURIComponent('拾味 The Pick'), { waitUntil: 'networkidle' });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/LIVE-080-ac2-thepick-desk.png` });
  log.push('ac2-thepick-desk');

  // 5. CMC Cafe 滾到底（逼 lazy-load）再拍
  await page.goto(LIVE + '#/canteen/cmc', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); }
  });
  await page.waitForTimeout(900);
  const broken = await page.evaluate(() => [...document.querySelectorAll('.dish-card img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
  log.push('cmc broken imgs: ' + broken.length);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/LIVE-080-cmc-desk.png`, fullPage: true });
  log.push('cmc-desk(fullPage)');
  await ctx.close();

  // ── 手機 ──
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', deviceScaleFactor: 2 });
  const mp = await mctx.newPage();
  await mp.goto(LIVE + '#/canteen/ac2', { waitUntil: 'networkidle' });
  await mp.waitForTimeout(1500);
  const mpills = await mp.$$('.cat-head-order');
  if (mpills.length) {
    await mpills[0].scrollIntoViewIfNeeded();
    await mp.waitForTimeout(500);
    await mp.screenshot({ path: `${OUT}/LIVE-080-ac2-order-pill-mob.png` });
    log.push('ac2-order-pill-mob');
  }
  const mobOverflow = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  log.push('ac2 mob overflow: ' + mobOverflow);
  await mctx.close();

  await browser.close();
  console.log(log.join('\n'));
})();
