/**
 * v0.11.0 本地驗證：AC2「四季茶坊」飲品同步（49 道）
 * 驗：版本 / 資料來源 / 菜品數 / 系列排序 / 價錢 / 圖片 / 溢出 / console error
 *
 * 注意：菜品卡預設排序是「熱門」（有評論的排前），所以**順序**要驗資料層
 * （REST 已按 sort.asc 回傳），不是驗 DOM 順序。
 */
const { chromium } = require('playwright-core');

const EXE = 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe';
const BASE = 'http://127.0.0.1:8422/index.html';
const VPS = [
  { w: 1440, h: 1000, tag: 'desk-1440' },
  { w: 1024, h: 1000, tag: 'ipad-1024' },
  { w: 390, h: 844, tag: 'mob-390' },
];

// 官方 47 道 + 保留的 2 道，依 sort 順序
const EXPECT_ORDER = [
  '甜橙美式', '白桃美式', '粉荔美式', '富士蘋果美式', '凍美式咖啡',
  '甜橙栀香檸檬茶', '白桃栀香檸檬茶', '粉荔栀香檸檬茶', '芝士荔枝栀香檸檬茶', '富士蘋果栀香檸檬茶',
  '栀香檸檬茶', '芭樂茉莉檸檬茶',
  '水蜜桃茉莉香檳', '百香果茉莉香檳', '青提茉莉香檳', '紅葡萄茉莉香檳', '香水檸檬茉莉香檳',
  '栀子奶茶', '抹茶奶茶', '茉莉奶茶', '栀子拿鐵', '龍井拿鐵', '茉莉拿鐵', '抹茶茉莉', '抹茶咖啡',
  '紅芭樂梳打',
  '熱咖啡', '熱黑咖啡', '熱奶茶', '熱鴛鴦', '熱檸檬茶', '熱檸檬水', '熱好立克', '熱阿華田',
  '凍咖啡', '凍黑咖啡', '凍奶茶', '凍鴛鴦', '凍檸檬茶', '凍檸檬水', '凍好立克', '凍阿華田',
  '酸梅湯', '百事', '輕怡百事', '七喜',
  '紅牛', '無糖紅牛', '富士蘋果紅牛',
];
const EXPECT_PRICE = { 熱咖啡: 6, 凍奶茶: 7.5, 紅牛: 18, 酸梅湯: 10, 茉莉奶茶: 19, 富士蘋果紅牛: 18, 紅芭樂梳打: 19 };

let pass = 0, fail = 0;
const check = (ok, msg) => {
  console.log(`   ${ok ? '✓' : '✗'} ${msg}`);
  ok ? pass++ : fail++;
};

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  for (const vp of VPS) {
    console.log(`\n───── ${vp.tag} ─────`);
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    const errs = [], badReq = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
    page.on('response', (r) => { if (r.status() >= 400) badReq.push(r.status() + ' ' + r.url()); });

    await page.goto(`${BASE}#/canteen/ac2`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.dish-card', { timeout: 20000 });
    await page.waitForTimeout(600);

    const meta = await page.evaluate(() => ({
      version: (document.querySelector('.footer-storage') || {}).textContent || '',
      source: (window.CityuEatsMenu || {}).source,
    }));
    check(/v0\.11\.0/.test(meta.version), `版本 = ${meta.version.trim()}`);
    check(meta.source === 'cloud', `資料來源 = ${meta.source}`);

    await page.locator('.chips .chip', { hasText: '四季茶坊' }).first().click();
    await page.waitForTimeout(600);

    // ① 資料層順序（＝ REST 的 sort.asc 順序）
    const dataOrder = await page.evaluate(() =>
      window.CITYU_EATS_DATA.dishes.filter((d) => d.canteenId === 'ac2' && d.cat === '四季茶坊').map((d) => d.zh));
    check(dataOrder.length === 49, `資料層菜品數 = ${dataOrder.length}（預期 49）`);
    const firstDiff = EXPECT_ORDER.findIndex((n, i) => dataOrder[i] !== n);
    check(firstDiff === -1, firstDiff === -1
      ? `系列排序正確（${dataOrder[0]} → ${dataOrder[48]}）`
      : `排序在第 ${firstDiff} 位不符：得到 ${dataOrder[firstDiff]}，預期 ${EXPECT_ORDER[firstDiff]}`);

    // ② DOM：卡片數、名稱集合、價錢
    const dom = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.dish-card'));
      return {
        n: cards.length,
        names: cards.map((c) => (c.querySelector('.dish-card-name') || {}).firstChild?.textContent?.trim() || ''),
        prices: Object.fromEntries(cards.map((c) => {
          const nm = (c.querySelector('.dish-card-name') || {}).firstChild?.textContent?.trim() || '';
          return [nm, ((c.querySelector('.price-tag .p') || {}).textContent || '').trim()];
        })),
      };
    });
    check(dom.n === 49, `DOM 卡片數 = ${dom.n}（預期 49）`);
    const missing = EXPECT_ORDER.filter((n) => !dom.names.includes(n));
    check(missing.length === 0, `49 道全部出現在畫面上${missing.length ? '，缺：' + missing.join('/') : ''}`);
    for (const [name, want] of Object.entries(EXPECT_PRICE)) {
      const got = dom.prices[name];
      check(got === '$' + want, `${name} 價錢 = ${got}（預期 $${want}）`);
    }

    // ③ 圖片：① 直接 HTTP 驗全部 49 張（決定性，不受 lazy load 影響）
    //         ② DOM 只驗前 12 張（一定已進視窗）
    const photos = await page.evaluate(() =>
      window.CITYU_EATS_DATA.dishes.filter((d) => d.canteenId === 'ac2' && d.cat === '四季茶坊').map((d) => d.photo));
    const origin = BASE.replace('/index.html', '');
    const httpBad = [];
    for (const p of photos) {
      const r = await fetch(origin + '/' + p);
      const buf = await r.arrayBuffer();
      if (!r.ok || buf.byteLength < 1000) httpBad.push(`${r.status} ${p}`);
    }
    check(photos.length === 49 && httpBad.length === 0,
      `49 張圖片 HTTP 檢查：全部 200${httpBad.length ? '，異常 ' + httpBad.join(', ') : ''}`);

    await page.locator('.dish-card').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    const img = await page.evaluate(() => {
      const inView = Array.from(document.querySelectorAll('.dish-card-img')).filter((i) => {
        const r = i.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
      });
      const bad = inView.filter((i) => !(i.complete && i.naturalWidth > 0));
      return { total: inView.length, bad: bad.map((i) => i.getAttribute('src')) };
    });
    check(img.total > 0 && img.bad.length === 0,
      `視窗內 ${img.total} 張卡片圖已渲染${img.bad.length ? '，未載入：' + img.bad.join(', ') : ''}`);

    const ovf = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(ovf <= 1, `水平溢出 = ${ovf}px`);
    check(badReq.length === 0, `HTTP ≥400 請求 = ${badReq.length}${badReq.length ? ' → ' + badReq[0] : ''}`);
    check(errs.length === 0, `console error = ${errs.length}${errs.length ? ' → ' + errs[0].slice(0, 120) : ''}`);

    await page.screenshot({ path: `v110-teahouse-${vp.tag}.png` });
    await page.close();
  }
  await browser.close();
  console.log(`\n===== 通過 ${pass} / 失敗 ${fail} =====`);
  process.exit(fail ? 1 : 0);
})();
