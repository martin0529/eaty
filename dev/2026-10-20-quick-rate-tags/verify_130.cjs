/* v0.13.0 驗證：避雷榜評論數、一鍵評分、預設標籤
 * 用 route 攔截 Supabase reviews，餵假資料 + 假寫入，完全不碰正式資料庫。
 */
const { chromium } = require('playwright-core')
const EXE = 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'
const OUT = 'C:/Users/1/WorkBuddy/2026-10-20-15-31-29/work/'

const mk = (dish, rating, verdict, text, nick, day) => ({
  id: `t-${dish}-${day}-${rating}`, dish_id: dish, rating, verdict,
  nickname: nick, text, created: `2026-10-${String(day).padStart(2, '0')}T10:00:00Z`,
})

const ROWS = [
  // 避雷榜：count 與百分比
  mk('ac2-th-iced-lemon-tea', 1, 'avoid', '太甜，冰又多。', '小明', 18),
  mk('ac2-th-iced-lemon-tea', 2, 'avoid', '完全冇茶味。', '阿珍', 17),
  mk('ac2-th-iced-lemon-tea', 4, 'ok', '一般啦。', 'Kelvin', 16),
  mk('ac2-th-matcha-coffee', 1, 'avoid', '抹茶粉結塊。', 'Suki', 18),
  mk('ac2-th-matcha-coffee', 2, 'avoid', '不值 $19。', '阿朗', 15),
  mk('ac2-th-matcha-coffee', 3, 'ok', '中規中矩。', 'Mandy', 14),
  mk('ac2-th-hot-milk-tea', 1, 'avoid', '淡到像水。', '阿輝', 13),
  mk('ac2-th-hot-milk-tea', 4, 'ok', '普通。', 'Wing', 12),
  mk('ac2-th-pepsi', 1, 'avoid', '冇氣。', '阿德', 11),
  mk('ac2-th-pepsi', 4, 'ok', '凍的。', 'Jo', 10),
  mk('ac2-th-sour-plum-tea', 1, 'avoid', '太酸。', '小美', 9),
  mk('ac2-th-sour-plum-tea', 2, 'avoid', '藥水味。', 'Ken', 8),
  // 熱門菜（有 count）
  mk('ac2-th-hot-coffee', 5, 'must', '平靚正。', 'Amy', 18),
  mk('ac2-th-hot-coffee', 5, 'must', '每日一杯。', 'Ben', 17),
  mk('ac2-th-hot-coffee', 4, 'must', '抵。', 'Cody', 16),
  mk('ac2-th-hot-coffee', 4, 'ok', '可以。', 'Dan', 15),
  // 一鍵評分會寫進這道
  mk('ac2-th-gardenia-latte', 4, 'ok', '不錯。', 'Eva', 14),
  mk('ac2-th-gardenia-latte', 5, 'must', '香。', 'Finn', 13),
]

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EXE })
  const errs = []
  let posted = null

  async function newPage(w, h) {
    const page = await browser.newPage({ viewport: { width: w, height: h } })
    page.on('pageerror', (e) => errs.push('pageerror: ' + e.message))
    page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 160)) })
    await page.route('**/rest/v1/reviews*', async (route) => {
      const req = route.request()
      if (req.method() === 'POST') {
        const body = JSON.parse(req.postData() || '{}')
        posted = body
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 'new-1', created: new Date().toISOString(), ...body }]),
        })
      }
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ROWS) })
    })
    return page
  }

  // ── 桌面 ──
  const page = await newPage(1440, 1180)
  await page.goto('http://127.0.0.1:8777/index.html', { waitUntil: 'load', timeout: 40000 })
  await page.waitForTimeout(2500)

  const avoid = await page.evaluate(() => {
    const sec = document.querySelector('#avoid')
    if (!sec) return null
    return [...sec.querySelectorAll('.avoid-row')].map((r) => ({
      name: r.querySelector('.avoid-dish-name')?.innerText.split('\n')[0],
      votes: r.querySelector('.avoid-votes')?.innerText.replace(/\n+/g, ' | '),
    }))
  })
  console.log('AVOID_ROWS', JSON.stringify(avoid, null, 1))
  await page.evaluate(() => document.querySelector('#avoid')?.scrollIntoView({ block: 'center' }))
  await page.waitForTimeout(1200)
  await page.screenshot({ path: OUT + 'v130-avoid-desk.png' })

  // 熱門菜 count 對照
  const hot = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.h-scroll .dish-card, .h-scroll article')].slice(0, 3)
    return cards.map((c) => c.innerText.replace(/\n+/g, ' | ').slice(0, 120))
  })
  console.log('HOT_CARDS', JSON.stringify(hot, null, 1))

  // ── 開菜品 modal（有評論的一道）──
  await page.evaluate(() => document.querySelector('[data-action="open-dish"]')?.click())
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('[data-action="open-dish"]')].find((x) => x.getAttribute('data-id') === 'ac2-th-gardenia-latte')
    if (b) b.click()
  })
  await page.waitForSelector('.quick-rate', { timeout: 8000 })
  await page.waitForTimeout(900)
  const quickInfo = await page.evaluate(() => ({
    bar: document.querySelector('.quick-rate')?.innerText.replace(/\n+/g, ' | '),
    btns: [...document.querySelectorAll('.quick-btn')].map((b) => b.dataset.quick + ':' + b.innerText.replace(/\n/g, '/')),
    tags: [...document.querySelectorAll('.tag-pick')].map((b) => b.dataset.tag),
  }))
  console.log('QUICK', JSON.stringify(quickInfo, null, 1))
  await page.evaluate(() => document.querySelector('.quick-rate')?.scrollIntoView({ block: 'center' }))
  await page.waitForTimeout(800)
  await page.screenshot({ path: OUT + 'v130-quickrate-desk.png' })

  // 標籤 toggle
  const tagRes = await page.evaluate(() => {
    const ta = document.querySelector('.review-form textarea[name="text"]')
    const picks = [...document.querySelectorAll('.tag-pick')]
    picks.find((p) => p.dataset.tag === '抵食').click()
    picks.find((p) => p.dataset.tag === '上菜快').click()
    const afterAdd = ta.value
    picks.find((p) => p.dataset.tag === '抵食').click()
    return { afterAdd, afterRemove: ta.value, onCount: document.querySelectorAll('.tag-pick.on').length }
  })
  console.log('TAGS', JSON.stringify(tagRes))

  // 一鍵評分（必食）
  await page.evaluate(() => document.querySelector('.quick-btn-must')?.click())
  await page.waitForTimeout(2500)
  const afterQuick = await page.evaluate(() => ({
    thanks: document.querySelector('.form-thanks')?.innerText || null,
    firstReview: document.querySelector('.review-item')?.innerText.replace(/\n+/g, ' | ').slice(0, 120) || null,
    count: document.querySelector('.dish-modal-rating .count')?.innerText || null,
  }))
  console.log('POSTED', JSON.stringify(posted))
  console.log('AFTER_QUICK', JSON.stringify(afterQuick, null, 1))
  await page.screenshot({ path: OUT + 'v130-after-quick-desk.png' })

  // ── 手機 ──
  const mp = await newPage(390, 900)
  await mp.goto('http://127.0.0.1:8777/index.html', { waitUntil: 'load', timeout: 40000 })
  await mp.waitForTimeout(2500)
  await mp.evaluate(() => document.querySelector('#avoid')?.scrollIntoView({ block: 'start' }))
  await mp.waitForTimeout(1000)
  await mp.screenshot({ path: OUT + 'v130-avoid-mob.png' })
  await mp.evaluate(() => {
    const b = [...document.querySelectorAll('[data-action="open-dish"]')].find((x) => x.getAttribute('data-id') === 'ac2-th-gardenia-latte')
    if (b) b.click()
  })
  await mp.waitForSelector('.quick-rate', { timeout: 8000 })
  await mp.waitForTimeout(900)
  await mp.evaluate(() => document.querySelector('.quick-rate')?.scrollIntoView({ block: 'center' }))
  await mp.waitForTimeout(700)
  await mp.screenshot({ path: OUT + 'v130-quickrate-mob.png' })
  const mobOverflow = await mp.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    winW: window.innerWidth,
    btnW: [...document.querySelectorAll('.quick-btn')].map((b) => Math.round(b.getBoundingClientRect().width)),
  }))
  console.log('MOB', JSON.stringify(mobOverflow))

  console.log('ERRORS', JSON.stringify(errs.slice(0, 6)))
  await browser.close()
})().catch((e) => { console.error('FATAL', e); process.exit(1) })
