/* 最終確認：版本號、資料來源、AC2 檔口相關 UI（標題區膠囊 + 分類標題列膠囊 + 單分類橫幅）。 */
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const BASE = process.argv[2] || 'http://127.0.0.1:8899/index.html';

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));

  await page.goto(BASE + '#/canteen/ac2', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const r = await page.evaluate(() => ({
    version: (window.CITYU_EATS_CONFIG || {}).VERSION,
    source: window.CityuEatsMenu.source,
    footerStorage: (document.querySelector('.footer-storage') || {}).textContent,
    headPills: Array.from(document.querySelectorAll('.cat-head-order')).map((a) => a.getAttribute('href')),
    bandStalls: Array.from(document.querySelectorAll('.canteen-order-stalls .cat-head-order')).map((a) => a.getAttribute('href')),
    dishCount: window.CITYU_EATS_DATA.dishes.filter((d) => d.canteenId === 'ac2').length,
  }));
  console.log(JSON.stringify(r, null, 2));

  // 單獨選中「西北麵館」→ 應該出現 .cat-order-bar
  await page.locator('.chips .chip', { hasText: '西北麵館' }).first().click();
  await page.waitForTimeout(500);
  const bar = await page.locator('.cat-order-bar a').first().getAttribute('href');
  console.log('單分類橫幅 href =', bar);
  console.log('console errors =', errs.length ? errs.join(' | ') : 0);
  await browser.close();
})();
