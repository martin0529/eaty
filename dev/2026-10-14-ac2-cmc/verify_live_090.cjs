/* v0.9.0 線上驗證：對 https://eaty.pages.dev/ 跑抽籤時段功能 */
const { chromium } = require('playwright-core');
const LIVE = 'https://eaty.pages.dev/';
const OUT = 'dev/2026-10-14-ac2-cmc';

const CASES = [
  ['食堂', '全日', 252], ['食堂', '早餐', 46], ['食堂', '午餐', 218], ['食堂', '晚餐', 187],
  ['AC1', '全日', 109], ['AC2', '全日', 51], ['AC3', '全日', 74], ['CMC', '全日', 18],
  ['CMC', '早餐', 10], ['CMC', '晚餐', 10],
];

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
    headless: true,
  });
  const fails = [];
  const log = [];

  for (const vp of [{ n: 'desk', w: 1440, h: 1000, dsf: 1 }, { n: 'mob', w: 390, h: 844, dsf: 2 }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, reducedMotion: 'reduce', deviceScaleFactor: vp.dsf });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));

    await page.goto(LIVE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1600);
    const ver = await page.evaluate(() => window.CITYU_EATS_CONFIG.VERSION);
    log.push(`[${vp.n}] version=${ver} source=${await page.evaluate(() => window.CityuEatsMenu.source)}`);
    if (ver !== '0.9.0') fails.push(`[${vp.n}] 版本仍係 ${ver}（部署未完成？）`);

    await page.click('[data-action="open-random"]');
    await page.waitForTimeout(700);
    const meals = await page.$$eval('.random-meals .chip', (e) => e.map((x) => x.innerText.trim()));
    if (JSON.stringify(meals) !== JSON.stringify(['全日', '早餐', '午餐', '晚餐'])) fails.push(`[${vp.n}] 時段 chips 不符：${meals}`);
    log.push(`[${vp.n}] 時段 chips = ${JSON.stringify(meals)}`);

    for (const [scope, meal, want] of CASES) {
      await page.locator('.random-scopes .chip').filter({ hasText: scope }).first().click();
      await page.waitForTimeout(180);
      const m = page.locator('.random-meals .chip', { hasText: new RegExp('^' + meal + '$') }).first();
      if (!(await m.isDisabled())) { await m.click(); await page.waitForTimeout(180); }
      const t = (await page.locator('#random-pool').innerText()).trim();
      const got = +(t.match(/(\d+)/) || [0, -1])[1];
      if (got !== want) fails.push(`[${vp.n}] ${scope} × ${meal}: 期望 ${want}，實際 ${got}（"${t}"）`);
    }
    log.push(`[${vp.n}] ${CASES.length} 個組合比對完成`);

    // 拍一張 AC2（早餐應禁用）
    await page.locator('.random-scopes .chip').filter({ hasText: 'AC2' }).first().click();
    await page.waitForTimeout(250);
    const dis = await page.locator('.random-meals .chip', { hasText: /^早餐$/ }).first().isDisabled();
    if (!dis) fails.push(`[${vp.n}] AC2 的「早餐」應為禁用`);
    log.push(`[${vp.n}] AC2 早餐 disabled = ${dis}`);
    await page.locator('.random-modal').screenshot({ path: `${OUT}/LIVE-090-modal-ac2-${vp.n}.png` });

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 0) fails.push(`[${vp.n}] 水平溢出 ${overflow}px`);
    if (errs.length) fails.push(`[${vp.n}] console errors: ${errs.slice(0, 3).join(' | ')}`);
    log.push(`[${vp.n}] overflow=${overflow} errs=${errs.length}`);
    await ctx.close();
  }
  await browser.close();
  console.log(log.join('\n'));
  console.log('\n=== 結果 ===');
  if (fails.length) { console.log('FAIL\n' + fails.join('\n')); process.exitCode = 1; }
  else console.log('ALL CLEAN ✓');
})();
