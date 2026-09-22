const { goTo } = require('./helpers/puppeteer.js')

describe('Component page', () => {
  it('should contain a "Nunjucks" tab heading', async () => {
    await goTo(page, '/components/back-link/')

    const nunjucksTabHeadings = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.js-tabs__item a')).filter(
        (element) => element.textContent === 'Nunjucks'
      )
    )

    expect(nunjucksTabHeadings[0]).toBeTruthy()
  })
})
