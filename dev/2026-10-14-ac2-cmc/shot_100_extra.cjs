/* 手機版（390）的食堂標題區 + 頁首「今天吃什麼」按鈕（順便看骰子圖示的點數是否填色）。 */
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const BASE = process.argv[2] || 'http://127.0.0.1:8899/index.html';

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await page.goto(BASE + '#/canteen/ac2', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await page.locator('.canteen-band').screenshot({ path: 'v100-band-ac2-mob.png' });
  await page.locator('.footer').screenshot({ path: 'v100-foot-ac2-mob.png' });
  await page.close();

  const p2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p2.goto(BASE, { waitUntil: 'networkidle' });
  await p2.waitForTimeout(900);
  await p2.locator('.btn-random-header').screenshot({ path: 'v100-dice-btn.png' });
  const dice = await p2.evaluate(() => {
    const c = document.querySelector('.btn-random-header .dot');
    if (!c) return null;
    const cs = getComputedStyle(c);
    return { tag: c.tagName, fill: cs.fill, stroke: cs.stroke };
  });
  console.log('骰子點數 computed style =', JSON.stringify(dice));
  await p2.close();

  const p3 = await browser.newPage({ viewport: { width: 1024, height: 900 } });
  await p3.goto(BASE, { waitUntil: 'networkidle' });
  await p3.waitForTimeout(900);
  await p3.locator('.canteen-grid').screenshot({ path: 'v100-cards-home-1024.png' });
  await p3.close();
  await browser.close();
  console.log('done');
})();
