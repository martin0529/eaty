/* 診斷：量 .random-meals .chip 的實際 computed style，找出為何 chip-on 沒變紅 */
const { chromium } = require('playwright-core');
const LOCAL = 'http://127.0.0.1:8422/';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
    headless: true,
  });
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(LOCAL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.click('[data-action="open-random"]');
  await page.waitForTimeout(600);

  const dump = await page.evaluate(() => {
    const out = [];
    const grab = (sel, label) => {
      document.querySelectorAll(sel).forEach((el) => {
        const cs = getComputedStyle(el);
        out.push({
          group: label,
          text: el.innerText.trim(),
          cls: el.className,
          disabled: el.disabled === true,
          bg: cs.backgroundColor,
          color: cs.color,
          opacity: cs.opacity,
          transform: cs.transform,
          anim: cs.animationName,
        });
      });
    };
    grab('.random-scopes .chip', 'scope');
    grab('.random-meals .chip', 'meal');
    return out;
  });
  console.log(JSON.stringify(dump, null, 1));

  // 再點一次「早餐」看有沒有變
  await page.locator('.random-meals .chip', { hasText: /^早餐$/ }).first().click();
  await page.waitForTimeout(900);
  const after = await page.evaluate(() => {
    const el = [...document.querySelectorAll('.random-meals .chip')].find((x) => x.innerText.trim() === '早餐');
    const cs = getComputedStyle(el);
    return { cls: el.className, disabled: el.disabled, bg: cs.backgroundColor, color: cs.color, opacity: cs.opacity, anim: cs.animationName };
  });
  console.log('點「早餐」後 900ms:', JSON.stringify(after));
  await browser.close();
})();
