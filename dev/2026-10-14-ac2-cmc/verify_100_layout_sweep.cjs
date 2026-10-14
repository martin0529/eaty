/* 版面掃描：11 種寬度 × 首頁 + 4 間食堂，檢查沒有橫向溢出、沒有 console error。
   主要用來回歸 v0.10.0 把平板左右留白由 40px 改成 64px 之後的版面。 */
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const BASE = process.argv[2] || 'http://127.0.0.1:8899/index.html';

const WIDTHS = [1440, 1312, 1200, 1180, 1100, 1024, 900, 834, 768, 760, 480, 390, 360];
const PAGES = ['#/', '#/canteen/ac1', '#/canteen/ac2', '#/canteen/ac3', '#/canteen/cmc'];

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const fails = [];
  const lines = [];
  for (const w of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push(String(e)));
    const ovf = [];
    for (const p of PAGES) {
      await page.goto(BASE + p, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      const o = await page.evaluate(() => {
        const d = document.documentElement;
        // 找出真正超出視窗的元素（排除刻意做成橫向捲動的 .chips／.h-scroll）
        const bad = [];
        document.querySelectorAll('body *').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          if (r.right > d.clientWidth + 1 && getComputedStyle(el).overflowX !== 'auto'
            && !el.closest('.chips, .h-scroll, .bowl, .hero-blob, .garnish, .sprk')) {
            bad.push(el.className || el.tagName);
          }
        });
        return { doc: d.scrollWidth - d.clientWidth, bad: bad.slice(0, 3) };
      });
      if (o.doc > 0 || o.bad.length) ovf.push(`${p} doc+${o.doc} ${o.bad.join(',')}`);
    }
    const line = `w=${String(w).padEnd(5)} overflow=${ovf.length ? '✗ ' + ovf.join(' | ') : 'none'}  errors=${errs.length ? errs.join('|') : '0'}`;
    lines.push(line);
    if (ovf.length) fails.push(line);
    if (errs.length) fails.push(`w=${w} console: ${errs.join('|')}`);
    await page.close();
  }
  await browser.close();
  console.log(lines.join('\n'));
  console.log('\n' + (fails.length ? 'FAILED:\n' + fails.join('\n') : 'ALL CLEAN ✓'));
})();
