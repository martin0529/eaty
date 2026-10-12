/* v0.6.9 驗證：頁尾免責聲明是否出現、排版是否正常、無 console error */
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

    await page.goto('http://127.0.0.1:8777/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);

    // 版本號
    const ver = await page.evaluate(() => window.CITYU_EATS_CONFIG.VERSION);
    const src = await page.evaluate(() => window.CityuEatsMenu && window.CityuEatsMenu.source);

    // 頁尾文字
    const notes = await page.$$eval('.footer-note', (els) =>
      els.map((e) => ({ cls: e.className, txt: e.innerText.trim() }))
    );
    const storage = await page.$eval('.footer-storage', (e) => e.innerText.trim()).catch(() => null);

    // 橫向溢出
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );

    // 免責聲明區塊是否真的可見（不是被裁掉）
    const coverage = await page.$('.footer-note-strong');
    let coverageBox = null;
    if (coverage) {
      coverageBox = await coverage.boundingBox();
      await coverage.scrollIntoViewIfNeeded();
    }

    await page.locator('.footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);
    await page.screenshot({
      path: `dev/2026-10-12-footer-ac3link/069-footer-${vp.name}.png`,
      clip: await (async () => {
        const b = await page.locator('.footer').boundingBox();
        return { x: b.x, y: Math.max(0, b.y), width: b.width, height: Math.min(b.height, 900) };
      })(),
    });

    results.push({
      vp: vp.name, ver, src, overflow, errCount: errs.length, errs,
      notes: notes.map((n) => n.cls + ' | ' + n.txt),
      storage,
      coverageVisible: !!(coverageBox && coverageBox.height > 10),
    });

    await ctx.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})();
