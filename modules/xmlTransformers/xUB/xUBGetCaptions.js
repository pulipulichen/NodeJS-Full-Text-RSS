
const captionCacheHour = 24 * 30
const captionCacheTime = captionCacheHour * 60 * 60 * 1000

const preferLang = [
  'Chinese Traditional',
  'Chinese (Traditional)',
  'Chinese (Hong Kong)',
  'Chinese Hong Kong',
  '中国語 (香港)',
  '中国語 香港',
  '中国語',
  'Chinese Simplified',
  'Chinese (Simplified)',
  'English',
  'Japanese'
]

// -------------------

const UBVideoIDParser = require('./UBVideoIDParser.js')

let browser
let page

const fs = require('fs')
const path = require('path')

const puppeteer = require('puppeteer');

const nodeCache = require('./../../../api/lib/cache/node-cache-sqlite.js')
const sleep = require('./../../../api/lib/async/sleep.js')

// ------------------------

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
    if (browser) {    
      browser.close()
    }
    browser = undefined
  }, 0)
  
}

const determineLang = async function (page) {
  await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
  
  let langsList = await page.evaluate(() => {
    //return document.querySelectorAll('div.flex.mt-5.text-center > div.layout.justify-start > button[data-title^="[SRT] "].ma-1.download-button.v-btn.v-btn--depressed.v-btn--flat.v-btn--outlined.theme--light.v-size--default.primary--text')
    
    $('#ds-qc-info').nextAll().remove()
    
    let buttons = $('div.flex.mt-5.text-center > div.layout.justify-start > button[data-title^="[SRT] "].ma-1.download-button.v-btn.v-btn--depressed.v-btn--flat.v-btn--outlined.theme--light.v-size--default.primary--text')
    
    let langs = []
    buttons.each((i, ele) => {
      let lang = $(ele).attr('data-title')
      lang = lang.slice(lang.indexOf(' ') + 1)
      langs.push(lang)
    })
    
    return langs
  })
  
   console.log(langsList)
   if (langsList.length === 1) {
     return langsList[0]
   }
   
  
  for (let i = 0; i < preferLang.length; i++) {
    //console.log(result)
    if (langsList.indexOf(preferLang[i]) > -1) {
      return preferLang[i]
    }
  }
  
  return false
}

let getSRTLock = false

const getSRT = async function (videoID) {
  videoID = UBVideoIDParser(videoID)
  try {
    return await nodeCache.get('xUBGetCaptions', videoID, async () => {
      let waitCount = 0
      while (getSRTLock === true) {
        console.log('wait', videoID)
        waitCount++
        if (waitCount > 20) {
          break
        }
        await sleep(10000)
      }

      getSRTLock = true

      /*
      let key = await getDownsubKey(videoID)
      let subContent = await getSubContent(key)
      console.log(subContent)
      */

      let downsubURL = `https://downsub.com/?url=https%3A%2F%2Fwww.yo` + `utu` + `be.com%2Fwatch%3Fv%3D` + videoID
      console.log('initBrowser', downsubURL)
      await initBrowser()

      if (videoID.indexOf('=') > -1) {
        videoID = videoID.slice(videoID.lastIndexOf('=') + 1)
      }


      console.log('downsubURL', downsubURL)

      await page.goto(
         downsubURL,
          { 
            waitUntil: 'load',
            timeout: 30000
          },
      );


      await page.waitForTimeout(1000);

      let downloadPath = './cache/downloadsub/' + videoID

      //console.log(`await page.waitForSelector('button')`)
      let selector = `button[data-title^="[SRT] "],i[aria-hidden="true"].v-icon.notranslate.pb-1.material-icons.theme--light.error--text`
      console.log('waitForSelector', videoID)
      await page.waitForSelector(selector, {
        timeout: 5000
      })

      // -----------------------
      // Check languages

      let lang = await determineLang(page)
      console.log('lang', videoID, lang)

      let srtContent = ''
      if (lang !== false) {

        // -----------------------

        const client = await page.target().createCDPSession();

        await client.send('Page.setDownloadBehavior', {
          behavior: 'allow', 
          downloadPath: downloadPath
        });

        fs.mkdirSync(downloadPath, { recursive: true })

        await page.click(`button[data-title^="[SRT] ${lang}"]`)

        await page.waitForTimeout(5000)

        let filename = getFirstFileInFolder(downloadPath)
        if (!filename) {
          fs.rmSync(downloadPath, { recursive: true })
          closeBrowser()
          return false
        }

        console.log(filename, path.resolve(downloadPath, filename))

        srtContent = fs.readFileSync(path.resolve(downloadPath, filename), 'utf8')
        srtContent = srtContent.trim()

        //console.log('Complete')

        //try {
        fs.rmSync(downloadPath, { recursive: true });
        //} catch (e) {}
      }

  //    let title = await page.evaluate(() => {
  //        return $(`div.v-card__title > a[target="_blank"][href^="https://www.youtube.com/watch?v="]`).text()
  //    })

      closeBrowser()
      getSRTLock = false
      /*
      return {
        title,
        srtContent
      }
      */
      if (srtContent) {
        console.log(srtContent.slice(0, 200))
      }
      return srtContent
    }, captionCacheTime)
  }
  catch (e) {
    console.error(e)
    closeBrowser()
    getSRTLock = false
    return false
  }
}

const getFirstFileInFolder = function (folder) {
  let list = []
  fs.readdirSync(folder).forEach(file => {
    list.push(file);
  })
  
  return list[0]
}

const convertSRTToCaptions = function (srtContent) {
  let captions = []
  
  let lines = srtContent.trim().split('\n')
  let info = {}
  let nextIsText = false
  
  //console.log(`lines.length`, lines.length)
  let lastEnd
    
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim()
    
    if (line === '') {
      continue
    }
    
    if (line.indexOf(' --> ') > -1) {
      nextIsText = true
      
      let parts = line.split(' --> ')
      let startSecond = timemarkToSecond(parts[0])
      let endSecond = timemarkToSecond(parts[1])
      
      info.start = startSecond
      info.end = endSecond
      info.dur = endSecond - startSecond
      
      if (lastEnd) {
        info.interval = info.start - lastEnd
        if (i > 0) {
          let prevCaption = captions[(captions.length - 1)]
          prevCaption.nextInterval = info.interval
        }
      }
      else {
        info.interval = 0
      }
      lastEnd = info.end
      
      continue
    }
    
    if (nextIsText) {
      
      info.text = line
      captions.push(info)
      info = {}
      
      nextIsText = false
    }
    
  }
  
  //console.log(captions[0])
  
  return captions
}

const timemarkToSecond = function (timemark) {
  // 00:01:56,452
  
  let parts1 = timemark.trim().split(':')
  
  let hour = Number(parts1[0])
  let minute = Number(parts1[1])
  let secondParts = parts1[2].split(',')
  
  let second = Number(secondParts[0])
  let pointSecond = Number(secondParts[1])
  
  second = second + (hour * 60 * 60)
  second = second + (minute * 60)
  second = second + (pointSecond / 1000)
  
  return second
}

const xUBGetCaptions = async function (videoID) {
  // 先確定看看有沒有快取
  if ((await nodeCache.isExists('xUBGetCaptions', videoID)) === false) {
    getSRT(videoID) // 不用await，因為不想卡死在這裡
    return false
    // 表示還在讀取中
  }
  
  let srtContent = await getSRT(videoID)
  
  if (srtContent === "") {
    // 表示沒有字幕
    return ''
  }
  
  if (srtContent === false) {
    return false
  }
  
  //console.error('[TODO] parse srt')
  //console.log(srtContent.slice(0, 200))
  //console.log(title)
  
  return convertSRTToCaptions(srtContent)
  
}

module.exports = xUBGetCaptions
