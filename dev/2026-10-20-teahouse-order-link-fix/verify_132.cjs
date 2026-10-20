const { chromium } = require('playwright-core')
const EXE = 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'
const OUT = 'C:/Users/1/WorkBuddy/2026-10-20-15-31-29/work/'
const BASE = process.env.BASE || 'http://127.0.0.1:8777/index.html'

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EXE })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } })
  const errs = []
  page.on('pageerror', (e) => errs.push(String(e)))
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) })

  // ① AC2 食堂頁：檔口點餐列
  await page.goto(BASE + '#/canteen/ac2', { waitUntil: 'load', timeout: 60000 })
  await page.waitForTimeout(3500)
  const canteen = await page.evaluate(() => {
    const row = document.querySelector('.canteen-order-stalls')
    return {
      hasRow: !!row,
      label: row ? row.querySelector('.cos-label')?.textContent.trim() : null,
      stalls: row ? [...row.querySelectorAll('.cat-head-order')].map((a) => a.textContent.trim() + ' -> ' + a.getAttribute('href')) : [],
      emptyOrderRow: !!document.querySelector('.order-link'),
    }
  })
  await page.screenshot({ path: OUT + 'v132-ac2-canteen.png' })

  // ② 四季茶坊分類頁：不應有「網上點餐」
  await page.evaluate(() => { location.hash = '#/canteen/ac2' })
  await page.waitForTimeout(800)
  const cat = await page.evaluate(() => {
    // 找分類標題列上的點餐膠囊
    const heads = [...document.querySelectorAll('.cat-head')]
    const th = heads.find((h) => h.textContent.includes('四季茶坊'))
    return {
      catHeadFound: !!th,
      catOrderLinks: th ? th.querySelectorAll('.cat-head-order').length : null,
      allCatOrderLinks: [...document.querySelectorAll('.cat-head-order')].map((a) => {
        const head = a.closest('.cat-head')
        return (head ? head.querySelector('.cat-head-zh, h3, b')?.textContent.trim() : '?') + ' -> ' + a.textContent.trim()
      }),
    }
  })

  // ③ 直接看資料層
  const data = await page.evaluate(() => {
    const cats = (window.CITYU_EATS_DATA && window.CITYU_EATS_DATA.categories) || []
    return cats.filter((c) => c.orderUrl).map((c) => c.id + ' -> ' + c.orderUrl)
  })

  console.log(JSON.stringify({ canteen, cat, data, errs }, null, 1))
  await browser.close()
})().catch((e) => { console.error('FATAL', e); process.exit(1) })
