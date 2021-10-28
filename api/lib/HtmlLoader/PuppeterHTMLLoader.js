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
    //headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=800,600'],
    ignoreHTTPSErrors: true,
    
  });
  page = await browser.newPage();
  await page.setUserAgent(
           'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36'
  )
}

let closeBrowserTimer
const closeBrowser = function () {
  clearTimeout(closeBrowserTimer)
  
  closeBrowserTimer = setTimeout(() => {
    browser.close()
    browser = undefined
  }, 30000)
  
}

let maxCacheYear = 1
let maxCacheTime = maxCacheYear * 365 * 24 * 60 * 60 * 1000


const validateReload = async function (url, result, validCond) {
  let reloadCounter = 0
  while (validCond(result)) {
    //console.log('href is login', url, reloadCounter, href)
    reloadCounter++
    if (reloadCounter >= 10) {
      break
    }
    await sleep(1000)

    //await page.goto('https://www.facebook.com/pulipuli.blogspot/posts/6734089429949788', {waitUntil: 'load'})

    await page.goto(url, {waitUntil: 'load'})
    result = await page.evaluate(() => {
        return {
          html: document.body.innerHTML.replace(/[\u0000-\u001F\u007F-\u009F]/g, ""),
          href: location.href
        }
    })

    if (!validCond(result)) {
      break;
    }
  }
  
  return result
}

const PuppeterHTMLLoader = async function (url, cacheMS) {
  if (!cacheMS) {
    cacheMS = maxCacheTime
  }
  
  return await nodeCache.get('puppeter-html-loader', url, async () => {
    while (isLoading) {
      await sleep(100)
    }
    isLoading = true
    let html
    let href
    while (true) {
      try {
        await initBrowser()

        await page.goto(url, {waitUntil: 'load'})

        let result = await page.evaluate(() => {
            return {
              html: document.body.innerHTML,
              href: location.href
            }
        })
        html = result.html
        href = result.href

        let validConfList = [
          ({href}) => href.startsWith('https://www.facebook.com/login/?next='),
          ({html}) => html.indexOf('Checking your browser before accessing') > -1
        ]

        for (let i = 0; i < validConfList.length; i++) {
          let result = await validateReload(url, {html, href}, validConfList[i])
          html = result.html
          href = result.href
        }

        await sleep(1000)

        //console.log(href)
        //await sleep(10)

    //    let html = await page.evaluate(() => {
    //        return document.body.innerHTML
    //    })

        closeBrowser()
        break
      }
      catch (e) {
        console.error(e)
        await sleep(10000)
      }
      
    }
    isLoading = false
    return html
  }, cacheMS)
}

module.exports = PuppeterHTMLLoader