const { chromium } = require('playwright-core');
const EXE = 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const BASE = 'http://127.0.0.1:8899/index.html';
const OLD = `.wrap{padding:0 40px}.filter-bar-row{padding:12px 40px}.meal-bar{padding:12px 40px 11px}`;
(async () => {
  const b = await chromium.launch({ executablePath: EXE });
  for (const inject of [false, true]) {
    const p = await b.newPage({ viewport: { width: 1024, height: 1000 } });
    await p.goto(BASE + '#/canteen/ac1', { waitUntil: 'networkidle' });
    await p.waitForTimeout(900);
    if (inject) { await p.addStyleTag({ content: OLD }); await p.waitForTimeout(300); }
    const r = await p.evaluate(() => {
      const g = document.querySelector('.footer-grid');
      const cs = getComputedStyle(g);
      return { padTop: cs.paddingTop, padBottom: cs.paddingBottom, padLeft: cs.paddingLeft,
               h: +g.getBoundingClientRect().height.toFixed(1) };
    });
    console.log((inject ? '舊 CSS（≤1180 覆寫存在）' : '新 CSS（已移除覆寫）  '), JSON.stringify(r));
    await p.close();
  }
  await b.close();
})();
