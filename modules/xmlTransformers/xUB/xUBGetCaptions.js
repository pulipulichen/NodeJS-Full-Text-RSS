
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
  'Chinese',
  'English',
  'Japanese'
]

// -------------------

const UBVideoIDParser = require('./UBVideoIDParser.js')

//let page

const fs = require('fs')
const path = require('path')

const puppeteer = require('puppeteer');

const nodeCache = require('./../../../api/lib/cache/node-cache-sqlite.js')
const sleep = require('./../../../api/lib/async/sleep.js')

const dayjs = require('dayjs')

const { exec } = require("child_process")

// ------------------------

const initBrowser = async function () {
  
  let browser
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
  
  return {browser, page}
}

let closeBrowserTimer
const closeBrowser = function (browser) {
  clearTimeout(closeBrowserTimer)
  
  closeBrowserTimer = setTimeout(() => {
    if (browser) {    
      browser.close()
      exec('rm -rf /tmp/puppeteer*', () => {})
      exec('rm -f /tmp/*.jpg', () => {})
      exec('rm -f /tmp/*.gif', () => {})
      exec('rm -f /tmp/*.png', () => {})
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

let queueList = []

const getSRT = async function (videoID, retry = 0) {
  videoID = UBVideoIDParser(videoID)
  
  let page, browser
  try {
    if (queueList.indexOf(videoID) > -1) {
      console.log(`[${dayjs().format('MMDD-HHmm')}] ` + 'queued ' + videoID)
      return false
    }
    
    //console.log(`[${dayjs().format('MMDD-HHmm')}] ` + '進入 Cache前：getSRT', videoID, getSRTLock, retry, queueList.join(','))
    return await nodeCache.get('xUBGetCaptions', videoID, async () => {
      console.log(`[${dayjs().format('MMDD-HHmm')}] ` + 'getSRT', videoID, getSRTLock, retry, queueList.join(','))

      // 為什麼這邊沒有讀取到？
      let waitCount = 0
      
      while (getSRTLock !== false) {
        console.log(`[${dayjs().format('MMDD-HHmm')}] ` + 'wait', videoID)
        waitCount++
        if (queueList.indexOf(videoID) === -1) {
          queueList.push(videoID)
        }
        
        if (waitCount > 20) {
          throw Error('Timeout ' + videoID)
          break
        }
        await sleep(30000)
      }
      
      queueList.indexOf(videoID)
      var index = queueList.indexOf(videoID);
      if (index !== -1) {
        queueList.splice(index, 1);
      }

      getSRTLock = videoID

      /*
      let key = await getDownsubKey(videoID)
      let subContent = await getSubContent(key)
      console.log(subContent)
      */

      let downsubURL = `https://downsub.com/?url=https%3A%2F%2Fwww.yo` + `utu` + `be.com%2Fwatch%3Fv%3D` + videoID
      console.log(`[${dayjs().format('MMDD-HHmm')}] ` + 'initBrowser', downsubURL)
      let init = await initBrowser()
      browser = init.browser
      page = init.page

      if (videoID.indexOf('=') > -1) {
        videoID = videoID.slice(videoID.lastIndexOf('=') + 1)
      }

      console.log(`[${dayjs().format('MMDD-HHmm')}] ` + 'downsubURL', downsubURL)

      await page.goto(
         downsubURL,
          { 
            waitUntil: 'load',
            timeout: 30000
          },
      );

      await page.waitForTimeout(1000);

      let downloadPath = '/tmp/NodeJS-Full-Text-RSS/cache/downloadsub/' + videoID

      //console.log(`await page.waitForSelector('button')`)
      let selector = `button[data-title^="[SRT] "],i[aria-hidden="true"].v-icon.notranslate.pb-1.material-icons.theme--light.error--text`
      console.log(`[${dayjs().format('MMDD-HHmm')}] ` + 'waitForSelector', videoID)
      await page.waitForSelector(selector, {
        timeout: 5000
      })

      // -----------------------
      // Check languages

      let lang = await determineLang(page)
      console.log(`[${dayjs().format('MMDD-HHmm')}] ` + 'lang', videoID, lang)

      let srtContent = ''
      if (lang !== false) {

        // -----------------------

        const client = await page.target().createCDPSession();

        fs.mkdirSync(downloadPath, { recursive: true })

        await client.send('Page.setDownloadBehavior', {
          behavior: 'allow', 
          downloadPath: downloadPath
        });

        console.log(`[${dayjs().format('MMDD-HHmm')}] ` + 'try to click', videoID, downloadPath)
        await page.click(`button[data-title^="[SRT] ${lang}"]`)

        let downloadCounter = 0
        let filename
        let maxRetry = 3
        while (downloadCounter < maxRetry) {
          console.log(`[${dayjs().format('MMDD-HHmm')}] ` + 'wait for download', videoID, downloadPath)
          await sleep(5000 * (downloadCounter + 1))

          filename = getFirstFileInFolder(downloadPath)
          if (!filename) {
            console.log('file not found.', downloadPath)
            if (downloadCounter < maxRetry - 1) {
              console.log('Retry wait...' + downloadCounter)
              downloadCounter++
              //if (downloadCounter % 5 === 0) {
              //  console.log('try to click again.', videoID, downloadPath)
              //  await page.click(`button[data-title^="[SRT] ${lang}"]`)
              //}
              continue
            }
            
            //console.log('download failed', videoID, downloadPath)
            fs.rmSync(downloadPath, { recursive: true })
            
            closeBrowser(browser)
            getSRTLock = false
            console.error(`[${dayjs().format('MMDD-HHmm')}] ` + 'download failed. retry again ' + videoID + ' retry ' + retry + ' ' + downloadPath)
            await sleep(5000)
            retry++
            if (retry === 3) {
              return false
            }
            
            return getSRT(videoID, retry)
          }
          else {
            break
          }
        }

        console.log(`[${dayjs().format('MMDD-HHmm')}] ` + 'download completed: ', filename, path.resolve(downloadPath, filename))

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

      closeBrowser(browser)
      getSRTLock = false
      await sleep(1000)
      /*
      return {
        title,
        srtContent
      }
      */
      if (srtContent) {
        console.log(`[${dayjs().format('MMDD-HHmm')}] ` + 'strContent output:')
        console.log('===========')
        console.log(srtContent.slice(0, 100))
        console.log('===========')
      }
      return srtContent
    }, captionCacheTime)
  }
  catch (e) {
    console.error(`[${dayjs().format('MMDD-HHmm')}] ` + 'Str error: ')
    console.error(e)
    console.log('===========')
    
    closeBrowser(browser)
    getSRTLock = false
    return ''
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
    // 這裡表示已經有快取，但是快取內容是false，那就清除快取，再試一次
    // 20220414-2208 
    await nodeCache.clear('xUBGetCaptions', videoID)
    return false
  }
  
  //console.error('[TODO] parse srt')
  //console.log(srtContent.slice(0, 200))
  //console.log(title)
  
  return convertSRTToCaptions(srtContent)
  
}

module.exports = xUBGetCaptions
