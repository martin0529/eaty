/* 補拍：單獨選「餃餃陣」→ 應出現 .cat-order-bar 橫幅
 * 分類篩選係按 chip（data-action="set-cat"），唔係 URL 參數。
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
  for (const vp of [{ n: 'desk', w: 1440, h: 1000, dsf: 1 }, { n: 'mob', w: 390, h: 844, dsf: 2 }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, reducedMotion: 'reduce', deviceScaleFactor: vp.dsf });
    const page = await ctx.newPage();
    await page.goto(LIVE + '#/canteen/ac2', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1400);

    // 點「餃餃陣」chip
    const chip = page.locator('#chip-strip .chip', { hasText: '餃餃陣' }).first();
    await chip.scrollIntoViewIfNeeded();
    await chip.click();
    await page.waitForTimeout(1200);

    const bar = await page.$('.cat-order-bar');
    const barHref = await page.locator('.cat-order-bar a').first().getAttribute('href').catch(() => null);
    const headOrderInCatView = await page.$$eval('.cat-head-order', (e) => e.length);
    const dishCount = await page.$$eval('.dish-card', (e) => e.length);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    log.push(`${vp.n}: cat-order-bar=${!!bar} href=${barHref} catHeadOrderInCatView=${headOrderInCatView} dishes=${dishCount} overflow=${overflow}`);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/LIVE-080-ac2-order-bar-${vp.n}.png` });
    await ctx.close();
  }
  await browser.close();
  console.log(log.join('\n'));
})();
