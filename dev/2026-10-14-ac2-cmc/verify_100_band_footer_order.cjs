/* v0.10.0 驗證：三項修正
   ① 食堂標題膠囊文字真正置中（移除隱形圓點）
   ② 平板（≤1180px）左右留白 40px → 64px，頁尾不再貼邊
   ③ AC2 標題區出現「檔口點餐 西北麵館／餃餃陣」連結；AC1／AC3 維持「官方網上點餐」；CMC 兩者皆無
   同時回歸檢查：0 console error、0 橫向溢出、四間食堂都還進得去。
   用法：node verify_100_band_footer_order.cjs [baseUrl]
*/
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const BASE = process.argv[2] || 'http://127.0.0.1:8899/index.html';

const VIEWPORTS = [
  { label: 'desk-1440', w: 1440, h: 1000 },
  { label: 'ipad-1024', w: 1024, h: 1000 },
  { label: 'mob-390', w: 390, h: 900 },
];

// 期望：order = 'canteen' | 'stalls' | 'none'
const EXPECT = {
  ac1: { order: 'canteen' },
  ac2: { order: 'stalls', stalls: ['西北麵館', '餃餃陣'] },
  ac3: { order: 'canteen' },
  cmc: { order: 'none' },
};

const probe = () => {
  const q = (s) => document.querySelector(s);
  const chip = q('.canteen-band-copy .chip');
  let chipInfo = null;
  if (chip) {
    const b = chip.getBoundingClientRect();
    const tn = Array.from(chip.childNodes).find((n) => n.nodeType === 3 && n.textContent.trim());
    let t = null;
    if (tn) {
      const r = document.createRange();
      r.selectNodeContents(tn);
      const tb = r.getBoundingClientRect();
      t = { l: +tb.left.toFixed(1), r: +tb.right.toFixed(1) };
    }
    chipInfo = {
      hasDot: !!chip.querySelector('.dot'),
      w: +b.width.toFixed(1),
      gapLeft: t ? +(t.l - b.left).toFixed(1) : null,
      gapRight: t ? +(b.right - t.r).toFixed(1) : null,
    };
  }
  const wrap = q('.footer-grid');
  const brand = q('.footer-brand');
  const footPad = wrap ? getComputedStyle(wrap).paddingLeft : null;
  const stalls = Array.from(document.querySelectorAll('.canteen-order-stalls .cat-head-order')).map((a) => ({
    text: a.textContent.trim(),
    href: a.getAttribute('href'),
  }));
  const canteenLink = q('.canteen-band-copy .order-link');
  return {
    chip: chipInfo,
    orderLink: canteenLink ? canteenLink.getAttribute('href') : null,
    stalls,
    hasStallRow: !!q('.canteen-order-stalls'),
    footPad,
    brandLeft: brand ? +brand.getBoundingClientRect().left.toFixed(1) : null,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
};

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const fails = [];
  const rows = [];
  const check = (ok, msg) => { if (!ok) fails.push(msg); return ok; };

  for (const vp of VIEWPORTS) {
    for (const id of Object.keys(EXPECT)) {
      const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
      const errs = [];
      page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
      page.on('pageerror', (e) => errs.push(String(e)));
      await page.goto(BASE + '#/canteen/' + id, { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);
      const r = await page.evaluate(probe);
      const tag = `${id}@${vp.label}`;
      const exp = EXPECT[id];

      // ① 膠囊置中
      check(r.chip && !r.chip.hasDot, `${tag}: 膠囊仍有 .dot`);
      if (r.chip) {
        const d = Math.abs(r.chip.gapLeft - r.chip.gapRight);
        check(d <= 1, `${tag}: 膠囊文字沒置中（左 ${r.chip.gapLeft} / 右 ${r.chip.gapRight}）`);
      }

      // ② 頁尾左右留白與 .wrap 一致
      const wantPad = vp.w <= 760 ? '22px' : '64px';
      check(r.footPad === wantPad, `${tag}: 頁尾左右內距 ${r.footPad}（預期 ${wantPad}）`);
      // 視窗比 .wrap 的 max-width(1312) 寬時，.wrap 會被 margin:auto 置中，
      // 文字左緣 = 置中偏移 + 內距，不是只有內距。
      const centerOffset = Math.max(0, (vp.w - 1312) / 2);
      const wantLeft = parseFloat(wantPad) + centerOffset;
      check(Math.abs(r.brandLeft - wantLeft) <= 1,
        `${tag}: 頁尾文字左緣 ${r.brandLeft}（預期 ${wantLeft}）`);

      // ③ 點餐入口
      if (exp.order === 'canteen') {
        check(!!r.orderLink && !r.hasStallRow, `${tag}: 應為「官方網上點餐」，實得 link=${r.orderLink} stalls=${r.hasStallRow}`);
      } else if (exp.order === 'stalls') {
        check(!r.orderLink && r.hasStallRow, `${tag}: 應為檔口列，實得 link=${r.orderLink} stalls=${r.hasStallRow}`);
        const names = r.stalls.map((s) => s.text.replace(/[↗\s]/g, ''));
        check(r.stalls.length === exp.stalls.length,
          `${tag}: 檔口數 ${r.stalls.length}（預期 ${exp.stalls.length}）`);
        for (const n of exp.stalls) check(names.some((x) => x.indexOf(n) >= 0), `${tag}: 缺檔口 ${n}`);
        for (const s of r.stalls) check(/^https:\/\/csd\.order\.place\/home\/store\/\d+$/.test(s.href), `${tag}: 檔口連結異常 ${s.href}`);
      } else {
        check(!r.orderLink && !r.hasStallRow, `${tag}: 應該沒有點餐入口`);
      }

      // 回歸
      check(errs.length === 0, `${tag}: console error ${errs.join(' | ')}`);
      check(r.overflowX === 0, `${tag}: 橫向溢出 ${r.overflowX}px`);

      rows.push(`${tag}  chip(gapL=${r.chip && r.chip.gapLeft},gapR=${r.chip && r.chip.gapRight})  order=${r.orderLink ? 'canteen' : r.hasStallRow ? 'stalls×' + r.stalls.length : 'none'}  footPad=${r.footPad}`);
      await page.close();
    }
  }
  await browser.close();
  console.log(rows.join('\n'));
  console.log('\n' + (fails.length ? 'FAILED:\n - ' + fails.join('\n - ') : 'ALL CLEAN ✓'));
  process.exit(fails.length ? 1 : 0);
})();
