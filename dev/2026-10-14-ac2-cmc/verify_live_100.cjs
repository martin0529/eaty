/* v0.10.0 線上驗證（https://eaty.pages.dev/）
   檢查：版本 0.10.0、膠囊置中、頁尾 iPad 內距 64px、AC2 檔口點餐列、AC1/CMC 正確、
        0 console error、0 橫向溢出。
   用法：node verify_live_100.cjs
*/
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const BASE = 'https://eaty.pages.dev/index.html';

const VIEWPORTS = [
  { label: 'desk-1440', w: 1440, h: 1000 },
  { label: 'ipad-1024', w: 1024, h: 1000 },
  { label: 'mob-390', w: 390, h: 900 },
];
const EXPECT = { ac1: 'canteen', ac2: 'stalls', ac3: 'canteen', cmc: 'none' };

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const fails = [];
  const check = (ok, m) => { if (!ok) fails.push(m); };

  for (const vp of VIEWPORTS) {
    for (const id of Object.keys(EXPECT)) {
      const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
      const errs = [];
      page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
      page.on('pageerror', (e) => errs.push(String(e)));
      await page.goto(BASE + '#/canteen/' + id, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      const r = await page.evaluate(() => {
        const chip = document.querySelector('.canteen-band-copy .chip');
        let gap = null;
        if (chip) {
          const b = chip.getBoundingClientRect();
          const tn = Array.from(chip.childNodes).find((n) => n.nodeType === 3 && n.textContent.trim());
          if (tn) {
            const rg = document.createRange(); rg.selectNodeContents(tn);
            const tb = rg.getBoundingClientRect();
            gap = [+(tb.left - b.left).toFixed(1), +(b.right - tb.right).toFixed(1)];
          }
        }
        const fg = document.querySelector('.footer-grid');
        const stalls = Array.from(document.querySelectorAll('.canteen-order-stalls .cat-head-order')).map((a) => a.getAttribute('href'));
        return {
          version: (window.CITYU_EATS_CONFIG || {}).VERSION,
          source: window.CityuEatsMenu.source,
          footerStorage: (document.querySelector('.footer-storage') || {}).textContent,
          chipGap: gap,
          hasDot: !!(chip && chip.querySelector('.dot')),
          footPad: fg ? getComputedStyle(fg).paddingLeft : null,
          footPadTop: fg ? getComputedStyle(fg).paddingTop : null,
          orderLink: !!document.querySelector('.canteen-band-copy .order-link'),
          stalls,
          overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      const tag = `${id}@${vp.label}`;
      check(r.version === '0.10.0', `${tag}: 版本 ${r.version} ≠ 0.10.0`);
      check(/v0\.10\.0/.test(r.footerStorage || ''), `${tag}: 頁尾版本行「${r.footerStorage}」`);
      check(r.source === 'cloud', `${tag}: source=${r.source}`);
      check(!r.hasDot && r.chipGap && Math.abs(r.chipGap[0] - r.chipGap[1]) <= 1,
        `${tag}: 膠囊沒置中 gap=${JSON.stringify(r.chipGap)} hasDot=${r.hasDot}`);
      const wantPad = vp.w <= 760 ? '22px' : '64px';
      // 手機斷點另有 .footer-grid{padding-top:38px;padding-bottom:26px}（刻意縮短）
      const wantPadTop = vp.w <= 760 ? '38px' : '56px';
      check(r.footPad === wantPad && r.footPadTop === wantPadTop,
        `${tag}: 頁尾內距 ${r.footPadTop}/${r.footPad}（預期 ${wantPadTop}/${wantPad}）`);
      if (EXPECT[id] === 'canteen') check(r.orderLink && !r.stalls.length, `${tag}: 應為官方網上點餐`);
      else if (EXPECT[id] === 'stalls') check(!r.orderLink && r.stalls.length === 2, `${tag}: 應為 2 個檔口連結，實得 ${r.stalls.length}`);
      else check(!r.orderLink && !r.stalls.length, `${tag}: 不應有入口`);
      check(errs.length === 0, `${tag}: console error ${errs.join(' | ')}`);
      check(r.overflowX === 0, `${tag}: 橫向溢出 ${r.overflowX}`);
      console.log(`${tag.padEnd(16)} v${r.version} src=${r.source} chipGap=${JSON.stringify(r.chipGap)} footPad=${r.footPadTop}/${r.footPad} order=${r.orderLink ? 'canteen' : r.stalls.length ? 'stalls×' + r.stalls.length : 'none'}`);
      await page.close();
    }
  }

  // 截圖：AC2 桌機標題區 + iPad 頁尾
  for (const [hash, sel, out, w] of [
    ['#/canteen/ac2', '.canteen-band', 'LIVE-100-ac2-band-desk.png', 1440],
    ['#/canteen/ac2', '.footer', 'LIVE-100-foot-ipad.png', 1024],
  ]) {
    const p = await browser.newPage({ viewport: { width: w, height: 1000 } });
    await p.goto(BASE + hash, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1500);
    await p.locator(sel).screenshot({ path: out });
    await p.close();
  }

  await browser.close();
  console.log('\n' + (fails.length ? 'FAILED:\n - ' + fails.join('\n - ') : 'ALL CLEAN ✓'));
  process.exit(fails.length ? 1 : 0);
})();
