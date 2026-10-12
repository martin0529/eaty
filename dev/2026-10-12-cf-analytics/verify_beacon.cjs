/* 驗證 Cloudflare Web Analytics beacon 是否真的發出請求 */
const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
    headless: true,
  });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
  });
  const page = await ctx.newPage();

  const beaconReqs = [];
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
  page.on('request', (r) => {
    const u = r.url();
    if (u.includes('cloudflareinsights') || u.includes('/cdn-cgi/rum')) {
      beaconReqs.push({ url: u.slice(0, 140), method: r.method(), type: r.resourceType() });
    }
  });
  page.on('response', async (r) => {
    const u = r.url();
    if (u.includes('cloudflareinsights') || u.includes('/cdn-cgi/rum')) {
      const hit = beaconReqs.find((b) => u.startsWith(b.url.slice(0, 100)));
      if (hit) hit.status = r.status();
    }
  });

  await page.goto('https://eaty.pages.dev/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  // 站內切頁（hash 路由）看會不會再送一次
  const before = beaconReqs.length;
  await page.goto('https://eaty.pages.dev/#/canteen/ac1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const beaconTag = await page.evaluate(() => {
    const s = document.querySelector('script[data-cf-beacon]');
    return s ? s.getAttribute('data-cf-beacon') : null;
  });
  const hasBeaconFn = await page.evaluate(() => typeof window.__cfBeacon !== 'undefined' || !!document.querySelector('script[src*="beacon.min.js"]'));

  console.log(JSON.stringify({
    beaconTag,
    beaconScriptPresent: hasBeaconFn,
    beaconRequests: beaconReqs,
    requestsAfterHashNav: beaconReqs.length - before,
    errCount: errs.length,
    errs,
  }, null, 2));

  await browser.close();
})();
