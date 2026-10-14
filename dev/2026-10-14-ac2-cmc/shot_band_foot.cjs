/* 把食堂頁 band 標題區塊與頁尾各自截圖，方便逐寬度目視比對。 */
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const BASE = process.argv[2] || 'http://127.0.0.1:8899/index.html';

const CASES = [
  { label: 'desk-1440', w: 1440, h: 1000 },
  { label: 'ipad-1024', w: 1024, h: 1000 },
  { label: 'ipad-834', w: 834, h: 1000 },
];

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  for (const cs of CASES) {
    const page = await browser.newPage({ viewport: { width: cs.w, height: cs.h } });
    await page.goto(BASE + '#/canteen/ac1', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const band = page.locator('.canteen-band');
    await band.screenshot({ path: `band-ac1-${cs.label}.png` });
    const foot = page.locator('.footer');
    await foot.screenshot({ path: `foot-ac1-${cs.label}.png` });
    await page.close();
  }
  // 首頁卡片
  const page = await browser.newPage({ viewport: { width: 1024, height: 1000 } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const cards = page.locator('.canteen-grid');
  await cards.screenshot({ path: 'cards-home-1024.png' });
  await page.close();
  await browser.close();
  console.log('done');
})();
