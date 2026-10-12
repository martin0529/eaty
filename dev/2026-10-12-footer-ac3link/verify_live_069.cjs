/* 線上驗證：v0.6.9 頁尾免責聲明是否真的部署到 eaty.pages.dev */
const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
    headless: true,
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));

  await page.goto('https://eaty.pages.dev/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);

  const ver = await page.evaluate(() => window.CITYU_EATS_CONFIG.VERSION);
  const src = await page.evaluate(() => window.CityuEatsMenu && window.CityuEatsMenu.source);
  const coverage = await page.$eval('.footer-note-strong', (e) => e.innerText.trim()).catch(() => null);
  const storage = await page.$eval('.footer-storage', (e) => e.innerText.trim()).catch(() => null);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

  await page.locator('.footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const b = await page.locator('.footer').boundingBox();
  await page.screenshot({
    path: 'dev/2026-10-12-footer-ac3link/LIVE-069-footer.png',
    clip: { x: b.x, y: Math.max(0, b.y), width: b.width, height: Math.min(b.height, 900) },
  });

  console.log(JSON.stringify({ ver, src, coverage, storage, overflow, errCount: errs.length, errs }, null, 2));
  await browser.close();
})();
