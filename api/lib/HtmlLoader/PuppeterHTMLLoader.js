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
    
    await page.goto(url, {waitUntil: 'load'})
    
    let {html, href} = await page.evaluate(() => {
        return {
          html: document.body.innerHTML,
          href: location.href
        }
    })
    
    let reloadCounter = 0
    while (href.startsWith('https://www.facebook.com/login/?next=')) {
      //console.log('href is login', url, reloadCounter, href)
      reloadCounter++
      if (reloadCounter >= 10) {
        break
      }
      await sleep(1000)
      
      //await page.goto('https://www.facebook.com/pulipuli.blogspot/posts/6734089429949788', {waitUntil: 'load'})
      
      await page.goto(url, {waitUntil: 'load'})
      let result = await page.evaluate(() => {
          return {
            html: document.body.innerHTML,
            href: location.href
          }
      })
      
      href = result.href
      html = result.html
      if (!href.startsWith('https://www.facebook.com/login/?next=')) {
        break;
      }
    }
    
    //console.log(href)
    //await sleep(10)
    
//    let html = await page.evaluate(() => {
//        return document.body.innerHTML
//    })
    
    closeBrowser()
    isLoading = false
    return html
  })
}

module.exports = PuppeterHTMLLoader