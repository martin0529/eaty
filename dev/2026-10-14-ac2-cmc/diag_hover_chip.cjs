/* 確認「已選中的 chip 被 hover 蓋掉紅底」是否為全站既有問題（食堂頁的分類 chip） */
const { chromium } = require('playwright-core');
const LOCAL = 'http://127.0.0.1:8422/';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
    headless: true,
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  await page.goto(LOCAL + '#/canteen/ac2', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);

  const read = () => page.evaluate(() => {
    const el = document.querySelector('#chip-strip .chip.chip-on');
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { text: el.innerText.trim(), cls: el.className, bg: cs.backgroundColor, color: cs.color };
  });

  console.log('A. 未 hover（食堂頁已選中的分類 chip）:', JSON.stringify(await read()));

  const chip = page.locator('#chip-strip .chip.chip-on').first();
  await chip.hover();
  await page.waitForTimeout(400);
  console.log('B. hover 之後                        :', JSON.stringify(await read()));

  // 同時量 modal 的範圍 chip
  await page.goto(LOCAL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.click('[data-action="open-random"]');
  await page.waitForTimeout(600);
  const s = page.locator('.random-scopes .chip.chip-on').first();
  console.log('C. modal 範圍 chip 未 hover           :', JSON.stringify(await page.evaluate(() => {
    const el = document.querySelector('.random-scopes .chip.chip-on'); const cs = getComputedStyle(el);
    return { text: el.innerText.trim(), bg: cs.backgroundColor, color: cs.color };
  })));
  await s.hover();
  await page.waitForTimeout(400);
  console.log('D. modal 範圍 chip hover 之後         :', JSON.stringify(await page.evaluate(() => {
    const el = document.querySelector('.random-scopes .chip.chip-on'); const cs = getComputedStyle(el);
    return { text: el.innerText.trim(), bg: cs.backgroundColor, color: cs.color };
  })));

  await browser.close();
})();
