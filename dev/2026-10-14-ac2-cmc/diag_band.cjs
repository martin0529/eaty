/* 診斷：食堂頁 band 標題區的對齊 + 頁尾左右邊界。
   目的：用「量測」而不是「目測」確認問題，並在修完後重跑比對。
   用法：node diag_band.cjs [baseUrl]
*/
const { chromium } = require('playwright-core');

const EXE = 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const BASE = process.argv[2] || 'http://127.0.0.1:8899/index.html';

const CASES = [
  { label: 'desk-1440', w: 1440, h: 1000 },
  { label: 'ipad-1180', w: 1180, h: 1000 },
  { label: 'ipad-1024', w: 1024, h: 1000 },
  { label: 'ipad-834', w: 834, h: 1000 },
  { label: 'mob-390', w: 390, h: 900 },
];

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const out = [];
  for (const cs of CASES) {
    const page = await browser.newPage({ viewport: { width: cs.w, height: cs.h } });
    await page.goto(BASE + '#/canteen/ac2', { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);

    const m = await page.evaluate(() => {
      const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { l: +b.left.toFixed(1), r: +b.right.toFixed(1), w: +b.width.toFixed(1) }; };
      const copy = document.querySelector('.canteen-band-copy');
      const chip = copy && copy.querySelector('.chip');
      const name = document.querySelector('.canteen-name');
      const hours = document.querySelector('.canteen-hours');
      const stats = document.querySelector('.canteen-stats');
      const grid = document.querySelector('.canteen-band-grid');
      const bandWrap = document.querySelector('.canteen-band').closest('.wrap');
      const foot = document.querySelector('.footer');
      const fgrid = document.querySelector('.footer-grid');
      const brand = document.querySelector('.footer-brand');
      const links = document.querySelector('.footer-links');
      const docW = document.documentElement.clientWidth;
      return {
        docW,
        wrapPad: bandWrap ? getComputedStyle(bandWrap).paddingLeft : null,
        grid: r(grid), copy: r(copy), chip: r(chip), name: r(name), hours: r(hours), stats: r(stats),
        chipTextAlign: chip ? getComputedStyle(chip).textAlign : null,
        chipJustify: chip ? getComputedStyle(chip).justifyContent : null,
        chipDisplay: chip ? getComputedStyle(chip).display : null,
        foot: r(foot), fgrid: r(fgrid), brand: r(brand), links: r(links),
        fgridPad: fgrid ? { l: getComputedStyle(fgrid).paddingLeft, r: getComputedStyle(fgrid).paddingRight } : null,
        overflowX: document.documentElement.scrollWidth - docW,
      };
    });
    out.push({ ...cs, ...m });
    await page.close();
  }
  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})();
