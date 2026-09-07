// click 1 (replaceState) → click 2 (router.refresh) on a page scrolled 800px down.
// `--control` skips click 1: a refresh with no prior replaceState must (and does) leave the page alone.
// Prints the scrollY after each step and every write to documentElement.scrollTop with its caller.
const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.addInitScript(() => {
    const log = (window.__scrollWrites = [])
    const d = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollTop')

    Object.defineProperty(Element.prototype, 'scrollTop', {
      configurable: true,
      get: d.get,
      set(value) {
        const before = window.scrollY

        d.set.call(this, value)

        if (this === document.documentElement || this === document.body) {
          log.push({ target: `${this.tagName}.scrollTop=${value}`, moved: window.scrollY !== before, stack: new Error().stack.split('\n').slice(2, 6).join(' | ') })
        }
      },
    })
  })

  await page.goto('http://localhost:4612/')
  await page.evaluate(() => window.scrollTo(0, 800))
  await page.waitForTimeout(300)
  console.log('scrolled to', await page.evaluate(() => window.scrollY))

  if (!process.argv.includes('--control')) {
    await page.click('#open')
    await page.waitForTimeout(500)
    console.log('after replaceState', await page.evaluate(() => window.scrollY), await page.evaluate(() => location.search))
  }

  await page.click('#refresh')
  await page.waitForTimeout(2500)
  console.log('after router.refresh()', await page.evaluate(() => window.scrollY))

  const writes = await page.evaluate(() => window.__scrollWrites.filter((w) => w.moved))
  console.log('document writes that MOVED the page:', JSON.stringify(writes, null, 2))

  await browser.close()
  process.exit(writes.length === 0 ? 0 : 1)
})()
