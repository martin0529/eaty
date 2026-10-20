const { chromium } = require('playwright-core')
const EXE = 'C:/Users/1/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'
const OUT = 'C:/Users/1/WorkBuddy/2026-10-20-15-31-29/work/'
const ROWS = [
  { id: 'a', dish_id: 'ac2-th-gardenia-latte', rating: 4, verdict: 'ok', nickname: 'Eva', text: '不錯。', created: '2026-10-14T10:00:00Z' },
  { id: 'b', dish_id: 'ac2-th-gardenia-latte', rating: 5, verdict: 'must', nickname: 'Finn', text: '香。', created: '2026-10-13T10:00:00Z' },
]

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EXE })
  for (const lang of ['zh', 'en']) {
    for (const [tag, w, h] of [['desk', 1440, 1180], ['mob', 390, 900]]) {
      const page = await browser.newPage({ viewport: { width: w, height: h } })
      const errs = []
      page.on('pageerror', (e) => errs.push(String(e)))
      page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) })
      if (lang === 'en') await page.addInitScript(() => localStorage.setItem('cityu-eats:lang', 'en'))
      await page.route('**/rest/v1/reviews*', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ROWS) }))
      await page.goto('http://127.0.0.1:8777/index.html', { waitUntil: 'load', timeout: 40000 })
      await page.waitForTimeout(2200)
      await page.evaluate(() => {
        const b = [...document.querySelectorAll('[data-action="open-dish"]')].find((x) => x.getAttribute('data-id') === 'ac2-th-gardenia-latte')
        if (b) b.click()
      })
      await page.waitForSelector('.tag-pick', { timeout: 8000 })
      await page.waitForTimeout(1200)
      await page.evaluate(() => document.querySelector('.review-form').scrollIntoView({ block: 'start' }))
      await page.waitForTimeout(700)

      const before = await page.evaluate(() => {
        const chips = [...document.querySelectorAll('.tag-pick')]
        return {
          count: chips.length,
          labels: chips.map((c) => c.dataset.tag),
          rows: new Set(chips.map((c) => Math.round(c.getBoundingClientRect().top))).size,
          minH: Math.min(...chips.map((c) => Math.round(c.getBoundingClientRect().height))),
          undefinedAny: chips.some((c) => /undefined|\{|\}/.test(c.textContent)),
          overflow: document.documentElement.scrollWidth - window.innerWidth,
        }
      })

      // 點新標籤：唔抵食 + 冇味，再點一次唔抵食 移除
      const pick = async (label) => page.evaluate((l) => {
        const c = [...document.querySelectorAll('.tag-pick')].find((x) => x.dataset.tag === l)
        if (c) c.click()
      }, label)
      await pick(lang === 'en' ? 'Poor value' : '唔抵食')
      await pick(lang === 'en' ? 'Flavourless' : '冇味')
      await page.waitForTimeout(400)
      const afterAdd = await page.evaluate(() => document.querySelector('.review-form textarea').value)
      await pick(lang === 'en' ? 'Poor value' : '唔抵食')
      await page.waitForTimeout(400)
      const afterRemove = await page.evaluate(() => document.querySelector('.review-form textarea').value)
      const onCount = await page.evaluate(() => document.querySelectorAll('.tag-pick.on').length)

      console.log(`[${lang}/${tag}]`, JSON.stringify({ ...before, afterAdd, afterRemove, onCount, errs }))
      await page.screenshot({ path: OUT + `v131-form-${tag}-${lang}.png` })
      await page.close()
    }
  }
  await browser.close()
})().catch((e) => { console.error('FATAL', e); process.exit(1) })
