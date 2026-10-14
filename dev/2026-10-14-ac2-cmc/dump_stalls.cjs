/* 印出目前載入的資料中，各食堂「有官方點餐連結」的檔口（分類）。 */
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const BASE = process.argv[2] || 'http://127.0.0.1:8899/index.html';

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const info = await page.evaluate(() => {
    const D = window.CITYU_EATS_DATA;
    const src = window.CityuEatsMenu.source;
    const cats = D.categories;
    const canteens = D.canteens;
    const rows = cats.filter((c) => c.orderUrl).map((c) => ({
      canteen: c.canteenId, id: c.id, zh: c.zh, en: c.en, orderUrl: c.orderUrl,
    }));
    return {
      source: src,
      canteenIds: canteens.map((c) => c.id),
      canteenOrderUrl: canteens.map((c) => ({ id: c.id, orderUrl: c.orderUrl || null })),
      stallsWithOrder: rows,
      catSampleKeys: Object.keys(cats[0]),
      dishCount: D.dishes.length,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
