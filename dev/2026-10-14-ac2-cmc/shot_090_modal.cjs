/* 拍抽籤 modal 的三種狀態（只拍 modal 本身，看 chip 的選中／禁用視覺） */
const { chromium } = require('playwright-core');
const LOCAL = 'http://127.0.0.1:8422/';
const OUT = 'dev/2026-10-14-ac2-cmc';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
    headless: true,
  });
  const log = [];

  async function shot(file, scope, meal) {
    const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 }, reducedMotion: 'reduce', deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(LOCAL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.click('[data-action="open-random"]');
    await page.waitForTimeout(600);
    await page.locator('.random-scopes .chip').filter({ hasText: scope }).first().click();
    await page.waitForTimeout(250);
    const m = page.locator('.random-meals .chip', { hasText: new RegExp('^' + meal + '$') }).first();
    if (!(await m.isDisabled())) { await m.click(); await page.waitForTimeout(250); }
    const pool = (await page.locator('#random-pool').innerText()).trim();
    const states = await page.$$eval('.random-meals .chip', (e) =>
      e.map((x) => ({ t: x.innerText.trim(), on: x.classList.contains('chip-on'), off: x.disabled })));
    log.push(`${file}: 範圍=${scope} 點「${meal}」→ pool="${pool}"\n   時段狀態=${JSON.stringify(states)}`);
    await page.locator('.random-modal').screenshot({ path: `${OUT}/${file}.png` });
    await ctx.close();
  }

  await shot('090-modal-default', '食堂', '全日');
  await shot('090-modal-ac2', 'AC2', '全日');
  await shot('090-modal-cmc-breakfast', 'CMC', '早餐');
  await browser.close();
  console.log(log.join('\n'));
})();
