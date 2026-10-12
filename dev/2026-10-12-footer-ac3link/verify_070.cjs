/* v0.7.0 驗證：頁尾「意見回饋 / 補充菜單」連結 */
const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
    headless: true,
  });

  const results = [];
  for (const vp of [
    { name: 'desk', width: 1440, height: 1000 },
    { name: 'mob', width: 390, height: 844 },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: 'reduce',
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));

    await page.goto('https://eaty.pages.dev/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);

    const ver = await page.evaluate(() => window.CITYU_EATS_CONFIG.VERSION);
    const cfgUrl = await page.evaluate(() => window.CITYU_EATS_CONFIG.FEEDBACK_URL);

    // 頁尾所有連結
    const links = await page.$$eval('.footer-links a', (els) =>
      els.map((e) => ({ txt: e.innerText.trim(), href: e.href }))
    );
    const notes = await page.$$eval('.footer-note', (els) => els.length);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );

    // 回饋連結是否在視窗內、可點
    const fb = page.locator('.footer-links a').first();
    const fbBox = await fb.boundingBox();

    await page.locator('.footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const b = await page.locator('.footer').boundingBox();
    await page.screenshot({
      path: `dev/2026-10-12-footer-ac3link/LIVE-070-footer-${vp.name}.png`,
      clip: { x: b.x, y: Math.max(0, b.y), width: b.width, height: Math.min(b.height, 900) },
    });

    results.push({
      vp: vp.name, ver, cfgUrl, notes, overflow, errCount: errs.length, errs,
      links, fbVisible: !!(fbBox && fbBox.height > 5),
    });
    await ctx.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})();
