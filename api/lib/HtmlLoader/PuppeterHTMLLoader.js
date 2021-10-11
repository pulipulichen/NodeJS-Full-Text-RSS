const puppeteer = require('puppeteer');
const sleep = require('./../async/sleep.js')
const nodeCache = require('./../cache/node-cache-sqlite.js')

let isLoading = false

let browser
let page

const initBrowser = async function () {
  if (browser) {
    return true
  }
  
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  page = await browser.newPage();
}

let closeBrowserTimer
const closeBrowser = function () {
  clearTimeout(closeBrowserTimer)
  
  closeBrowserTimer = setTimeout(() => {
    browser.close()
    browser = undefined
  }, 30000)
  
}

const PuppeterHTMLLoader = async function (url) {
  return await nodeCache.get('puppeter-html-loader', url, async () => {
    while (isLoading) {
      await sleep(100)
    }
    isLoading = true
    await initBrowser()
    
    await page.goto(url);
    
    let html = await page.evaluate(() => {
        return document.body.innerHTML
    })

    closeBrowser()
    isLoading = false
    return html
  })
}

module.exports = PuppeterHTMLLoader