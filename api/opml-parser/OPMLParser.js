/* global __dirname */

const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

const decode = require('html-entities').decode

const OPMLParser = async function () {
  let feedPath = path.resolve(__dirname, './feedly-c52706de-117c-4c58-b21d-75e935448738-2021-10-12.opml')
  //console.log(feedPath)
  let feedXML = fs.readFileSync(feedPath, 'utf8')
  //console.log(feedXML)
  const $ = cheerio.load(feedXML, {
    xmlMode: true,
    decodeEntities: false
  })
  
  // 200 https://blog.miniasp.com/post/2008/03/26/syndication.axd
  // 404 https://www.zdnet.com.tw/rss/news_webapps.htm
  //console.log(await isURLAvailable(''))
  
  let urlList = await parseAvailableURL($)
  
  return urlList
}

const parseAvailableURL = async function ($) {
  let urlList = []
  
  let outlineList = $('outline[xmlUrl]')
  for (let i = 0; i < outlineList.length; i++) {
    let outline = outlineList.eq(i)
    
    let title = outline.attr('title').trim()
    let url = outline.attr('xmlUrl')
    
    while (url.startsWith('http://exp-full-text-rss-2013.dlll.nccu.edu.tw/full-text-rss/makefulltextfeed.php?url=')) {
      url = url.slice(86).trim()
    }
    
    while (url.startsWith('http://www.pulipuli.tk/full-text-rss/makefulltextfeed.php?url=')) {
      url = url.slice(62).trim()
    }
    
    while (url.startsWith('http://mrss.dokoda.jp/a/http/mrss.dokoda.jp/a/http/')) {
      url = url.slice(51).trim()
    }
    
    while (url.startsWith('http://feedex.net/feed/')) {
      url = url.slice(23).trim()
    }
    
    while (url.startsWith('http://mrss.dokoda.jp/a/http/')) {
      url = url.slice(29).trim()
    }
    
    while (url.startsWith('http://www.wizardrss.com/feed/')) {
      url = url.slice(30).trim()
    }
    
    while (url.startsWith('http://fullrss.net/a/http/')) {
      url = url.slice(26).trim()
    }
    
    while (url.startsWith('http://fulltextrssfeed.com/')) {
      url = url.slice(27).trim()
    }
    
    while (url.startsWith('http://fivefilters.org/content-only/makefulltextfeed.php?url=')) {
      url = url.slice(61).trim()
    }
    // ----------------------------
    
    if (url.indexOf('&amp;max=') > -1) {
      url = url.slice(0, url.indexOf('&amp;max='))
    }
    
    if (url.indexOf('&amp;amp;max=') > -1) {
      url = url.slice(0, url.indexOf('&amp;amp;max='))
    }
    
    if (url.startsWith('https%3A%2F%2F')
            || url.indexOf('%2F') > -1) {
      url = decodeURIComponent(url)
    }
    
    while (url.indexOf('&amp;') > -1) {
      url = decode(url)
    }
    
    while (title.indexOf('&amp;') > -1) {
      title = decode(title)
    }
    
    // -------------
    
    if (url.startsWith('//')) {
      url = 'https:' + url
    }
    else if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = 'https://' + url
    }
    
    //if (await isURLAvailable(url) === false) {
    //  continue
    //}
    
    urlList.push({
      title,
      feedURL: url
    })
  }
  
  return urlList
}

const isURLAvailable = async function (url) {
  if (url.startsWith('https://script.googleusercontent.com/macros/echo?')
          || url.startsWith('http://page2rss.com/rss/')) {
    return false
  }
  if (url.startsWith('http://www.emeraldinsight.com/')
          || url.startsWith('https://www.youtube.com/feeds/')) {
    return true
  }
  
  return true
}

module.exports = OPMLParser