/* 精確量測：chip 裡「圓點 + 文字」相對 pill 的位置。
   用來判斷「文字看起來沒置中」的真正原因（是否為隱形圓點佔位）。 */
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const BASE = process.argv[2] || 'http://127.0.0.1:8899/index.html';

const probe = () => {
  const info = (chip) => {
    if (!chip) return null;
    const b = chip.getBoundingClientRect();
    const dot = chip.querySelector('.dot');
    let dotInfo = null;
    if (dot) {
      const d = dot.getBoundingClientRect();
      const cs = getComputedStyle(dot);
      dotInfo = { w: +d.width.toFixed(1), l: +d.left.toFixed(1), bg: cs.backgroundColor, display: cs.display };
    }
    // 文字節點範圍
    let textBox = null;
    const tn = Array.from(chip.childNodes).find((n) => n.nodeType === 3 && n.textContent.trim());
    if (tn) {
      const r = document.createRange();
      r.selectNodeContents(tn);
      const tb = r.getBoundingClientRect();
      textBox = { l: +tb.left.toFixed(1), r: +tb.right.toFixed(1), w: +tb.width.toFixed(1) };
    }
    return {
      pill: { l: +b.left.toFixed(1), r: +b.right.toFixed(1), w: +b.width.toFixed(1) },
      dot: dotInfo, text: textBox,
      gapLeft: textBox ? +(textBox.l - b.left).toFixed(1) : null,
      gapRight: textBox ? +(b.right - textBox.r).toFixed(1) : null,
      justify: getComputedStyle(chip).justifyContent,
      textAlign: getComputedStyle(chip).textAlign,
    };
  };
  return {
    homeCard: info(document.querySelector('.canteen-card .chip')),
    bandChip: info(document.querySelector('.canteen-band-copy .chip')),
  };
};

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  console.log('=== 首頁（canteen-card）===');
  console.log(JSON.stringify((await page.evaluate(probe)).homeCard, null, 2));
  await page.goto(BASE + '#/canteen/ac1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  console.log('=== 食堂頁（canteen-band）===');
  console.log(JSON.stringify((await page.evaluate(probe)).bandChip, null, 2));
  await browser.close();
})();
