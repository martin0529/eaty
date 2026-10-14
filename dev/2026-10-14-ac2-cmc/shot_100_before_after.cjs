/* 產生「修改前 / 修改後」對照截圖。
   做法：修改後的網站照跑，再用「注入舊 CSS / 把圓點插回去」的方式還原修改前的外觀，
   兩張都截同一區塊，最後用 PIL 疊成一張對照圖。 */
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const BASE = process.argv[2] || 'http://127.0.0.1:8899/index.html';

const OLD_PAD = `.wrap{padding:0 40px}.filter-bar-row{padding:12px 40px}.meal-bar{padding:12px 40px 11px}`;
const READD_DOT = () => {
  document.querySelectorAll('.canteen-band-copy .chip, .canteen-card .chip').forEach((el) => {
    if (!el.querySelector('.dot')) el.insertAdjacentHTML('afterbegin', '<i class="dot"></i>');
  });
};

async function grab(browser, { w, h, hash, sel, out, before }) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(BASE + hash, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  if (before) {
    await page.addStyleTag({ content: OLD_PAD });
    await page.evaluate(READD_DOT);
    await page.waitForTimeout(300);
  }
  await page.locator(sel).screenshot({ path: out });
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  // ① 頁尾（iPad 1024）
  await grab(browser, { w: 1024, h: 1000, hash: '#/canteen/ac1', sel: '.footer', out: 'cmp-foot-before.png', before: true });
  await grab(browser, { w: 1024, h: 1000, hash: '#/canteen/ac1', sel: '.footer', out: 'cmp-foot-after.png', before: false });
  // ② 標題膠囊（AC1，桌機）
  await grab(browser, { w: 1440, h: 1000, hash: '#/canteen/ac1', sel: '.canteen-band-copy', out: 'cmp-chip-before.png', before: true });
  await grab(browser, { w: 1440, h: 1000, hash: '#/canteen/ac1', sel: '.canteen-band-copy', out: 'cmp-chip-after.png', before: false });
  // ③ AC2 標題區點餐列（桌機）
  await grab(browser, { w: 1440, h: 1000, hash: '#/canteen/ac2', sel: '.canteen-band-copy', out: 'cmp-ac2-after.png', before: false });
  await browser.close();
  console.log('done');
})();
