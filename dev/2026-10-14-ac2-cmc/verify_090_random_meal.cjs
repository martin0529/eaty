/* v0.9.0 本地驗證：抽籤池重算 + 時段選擇
 * 前提：本機 http://127.0.0.1:8422 已起靜態伺服器（cwd = cityu-eats-motion）
 */
const { chromium } = require('playwright-core');
const LOCAL = 'http://127.0.0.1:8422/';
const OUT = 'dev/2026-10-14-ac2-cmc';

const EXPECT = {
  '全日': { '': 252, ac1: 109, ac2: 51, ac3: 74, cmc: 18 },
  '早餐': { '': 46, ac1: 22, ac2: 0, ac3: 14, cmc: 10 },
  '午餐': { '': 218, ac1: 83, ac2: 51, ac3: 66, cmc: 18 },
  '晚餐': { '': 187, ac1: 60, ac2: 51, ac3: 66, cmc: 10 },
};
const SCOPE_LABEL = { '': '食堂', ac1: 'AC1', ac2: 'AC2', ac3: 'AC3', cmc: 'CMC' };

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

    await page.goto(LOCAL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    const ver = await page.evaluate(() => window.CITYU_EATS_CONFIG.VERSION);
    const src = await page.evaluate(() => window.CityuEatsMenu.source);
    log.push(`[${vp.n}] version=${ver} source=${src} totalDishes=${await page.evaluate(() => window.CITYU_EATS_DATA.dishes.length)}`);

    // 開抽籤 modal
    await page.click('[data-action="open-random"]');
    await page.waitForTimeout(700);

    const mealRow = await page.$$('.random-meals .chip');
    if (mealRow.length !== 4) fails.push(`[${vp.n}] 時段 chips 應為 4，實際 ${mealRow.length}`);
    const labels = await page.$$eval('.random-meals .chip', (e) => e.map((x) => x.innerText.trim()));
    log.push(`[${vp.n}] 時段 chips = ${JSON.stringify(labels)}`);
    if (JSON.stringify(labels) !== JSON.stringify(['全日', '早餐', '午餐', '晚餐'])) fails.push(`[${vp.n}] 時段標籤不符：${labels}`);

    const scopeLabels = await page.$$eval('.random-scopes .chip', (e) => e.map((x) => x.innerText.trim()));
    log.push(`[${vp.n}] 範圍 chips = ${JSON.stringify(scopeLabels)}`);

    const poolText = async () => (await page.locator('#random-pool').innerText()).trim();
    const readPool = async () => {
      const t = await poolText();
      const m = t.match(/(\d+)/);
      return m ? +m[1] : -1;
    };

    // 逐一測「範圍 × 時段」的可抽數
    for (const [mealLabel, byScope] of Object.entries(EXPECT)) {
      for (const scopeId of ['', 'ac1', 'ac2', 'ac3', 'cmc']) {
        // 點時段
        const mealChip = page.locator('.random-meals .chip', { hasText: new RegExp('^' + mealLabel + '$') }).first();
        const disabled = await mealChip.isDisabled();
        // 點範圍
        const scopeChip = page.locator('.random-scopes .chip').filter({ hasText: SCOPE_LABEL[scopeId] }).first();
        await scopeChip.click();
        await page.waitForTimeout(160);
        // 範圍換完後，時段可能被禁用 → 重新取
        const mealDisabled = await page.locator('.random-meals .chip', { hasText: new RegExp('^' + mealLabel + '$') }).first().isDisabled();
        if (!mealDisabled) {
          await page.locator('.random-meals .chip', { hasText: new RegExp('^' + mealLabel + '$') }).first().click();
          await page.waitForTimeout(160);
        }
        const got = await readPool();
        const want = byScope[scopeId];
        const shouldDisable = want === 0;
        const onMeal = await page.$eval('.random-meals .chip-on', (e) => e.innerText.trim()).catch(() => '?');
        const ok = shouldDisable
          ? (mealDisabled && got === EXPECT['全日'][scopeId])   // 該時段 0 道 → 應禁用，並退回「全日」顯示該範圍的全日數
          : (got === want && onMeal === mealLabel);
        if (!ok) {
          fails.push(`[${vp.n}] ${scopeId || 'all'} × ${mealLabel}: 期望 ${shouldDisable ? `禁用(全日 ${byScope['']})` : want}，實際 ${got}（chipOn=${onMeal} disabled=${mealDisabled}）`);
        } else {
          log.push(`  ok ${scopeId || 'all'} × ${mealLabel} = ${shouldDisable ? '禁用→' : ''}${got}`);
        }
        // 回到全範圍
        await page.locator('.random-scopes .chip').filter({ hasText: '食堂' }).first().click();
        await page.waitForTimeout(120);
      }
    }

    // 抽一次：選 CMC × 早餐 → 抽到的必須是早餐分類
    await page.locator('.random-scopes .chip').filter({ hasText: 'CMC' }).first().click();
    await page.waitForTimeout(200);
    await page.locator('.random-meals .chip', { hasText: /^早餐$/ }).first().click();
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${OUT}/090-random-meal-${vp.n}.png` });
    await page.click('#roll-btn');
    await page.waitForTimeout(2600);
    const winner = (await page.locator('.random-flip').innerText()).trim();
    const winnerOk = await page.evaluate((name) => {
      const d = window.CITYU_EATS_DATA.dishes.find((x) => (x.zh || '') === name || (x.en || '') === name);
      if (!d) return { found: false };
      const cat = window.CITYU_EATS_DATA.categories.find((c) => c.id === d.cat);
      return { found: true, canteen: d.canteenId, meal: cat ? cat.meal : null, cat: d.cat };
    }, winner);
    log.push(`[${vp.n}] 抽到「${winner}」→ ${JSON.stringify(winnerOk)}`);
    if (!winnerOk.found || winnerOk.canteen !== 'cmc' || !(winnerOk.meal || []).includes('breakfast')) {
      fails.push(`[${vp.n}] 抽到的菜不符 CMC×早餐：${winner} ${JSON.stringify(winnerOk)}`);
    }
    await page.screenshot({ path: `${OUT}/090-random-result-${vp.n}.png` });

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    log.push(`[${vp.n}] modal 水平溢出 = ${overflow}`);
    if (overflow > 0) fails.push(`[${vp.n}] 水平溢出 ${overflow}px`);
    if (errs.length) fails.push(`[${vp.n}] console errors: ${errs.slice(0, 3).join(' | ')}`);

    await ctx.close();
  }
  await browser.close();

  console.log(log.join('\n'));
  console.log('\n=== 結果 ===');
  if (fails.length) { console.log('FAIL\n' + fails.join('\n')); process.exitCode = 1; }
  else console.log('ALL CLEAN ✓');
})();
