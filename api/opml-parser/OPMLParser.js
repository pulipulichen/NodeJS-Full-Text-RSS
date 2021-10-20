/* global __dirname */

const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

const decode = require('html-entities').decode
const urlExists = require("url-exists")

const NodeCacheSQLite = require('./../lib/cache/node-cache-sqlite.js')
const HtmlLoader = require('./../lib/HtmlLoader/HtmlLoader.js')

const OPMLParser = async function () {
  let feedPath = path.resolve(__dirname, './feedly.opml')
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
  //console.log(await isURLAvailable('https://www.zdnet.com.tw/rss/news_webapps.htm'))
  
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
    
    while (url.startsWith('http://exp-full-text-rss-2013.dlll.nccu.edu.tw/full-text-rss/makefulltextfeed.php?url=exp-full-text-rss-2013.dlll.nccu.edu.tw/full-text-rss/feed_reformator.php?url=')) {
      url = url.slice(164).trim()
    }
    
    while (url.startsWith('http://pulipuli.gopagoda.com/full-text-rss/makefulltextfeed.php?url=')) {
      url = url.slice(68).trim()
    }
    
    while (url.startsWith('http://exp-full-text-rss-2013.dlll.nccu.edu.tw/full-text-rss/makefulltextfeed.php?url=')) {
      url = url.slice(86).trim()
    }
    
    while (url.startsWith('https://exp-full-text-rss-2013.dlll.nccu.edu.tw/full-text-rss/feed_reformator.php?url=')) {
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
    let status = await NodeCacheSQLite.get('feed-status', url, async () => {
      let status = 'Subscribable'

      if (url.startsWith('//')) {
        url = 'https:' + url
      }
      else if (!url.startsWith('https://') && !url.startsWith('http://')) {
        url = 'https://' + url
      }

      if (await isURLAvailable(url) === false) {
        if (url.startsWith('https://')) {
          url = 'http://' + url.slice(8)

          if (await isURLAvailable(url) === false) {
            status = 'Unreachable'
            //continue
          }
        }
        else {
          status = 'Unreachable'
        }
      }

      if (status === 'Subscribable'
              && await isXML(url) === false) {
        status = 'Not RSS'
      }
    }, 30 * 24 * 60 * 60 * 1000)
      
    // -------------
    
    if (title.endsWith('(まるごとRSS)')) {
      title = title.slice(0, -9).trim()
    }
    
    if (title.endsWith(' [expanded by feedex.net]')) {
      title = title.slice(0, -25).trim()
    }
    
    if (title.endsWith('[WizardRss]')) {
      title = title.slice(0, -11).trim()
    }
    
    if (title.endsWith(' [feedex]')) {
      title = title.slice(0, -9).trim()
    }
    
    if (title.endsWith('(PIXNET)')) {
      title = title.slice(0, -8).trim()
    }
    
    if (title.endsWith(':: 痞客邦 PIXNET ::')) {
      title = title.slice(0, -16).trim()
    }
    
    if (title.endsWith(':: 隨意窩 Xuite ::')) {
      title = title.slice(0, -15).trim()
    }
    
    // 
    
    // -------------
    
    urlList.push({
      title,
      feedURL: url,
      status
    })
  }
  
  return urlList
}

const isURLAvailable = async function (url) {
  //return true
  return await NodeCacheSQLite.get('url-available', url, async () => {
    if (url.startsWith('https://script.googleusercontent.com/macros/echo?')
            || url.startsWith('http://page2rss.com/rss/')
            || url.startsWith('https://twitrss.me/')
            || url.startsWith('https://teacherlibrarian.lib.ntnu.edu.tw/')
            || url.startsWith('https://www.facebook.com/feeds/page.php?format=')) {
      return false
    }
    if (url.startsWith('http://www.emeraldinsight.com/')
            || url.startsWith('https://www.youtube.com/feeds/')) {
      return true
    }

    //return await urlExists(url) 
    return new Promise((resolve) => {
      let isTimeout = false
      let isChecked = false
      setTimeout(() => {
        if (isChecked) {
          return true
        }
        //process.stdout.write('timeout false')
        console.log('timeout false', url)
        resolve(false)
        isTimeout = true
      }, 10000)
      
      //process.stdout.write('Testing ' + url + '...')
      console.log('Testing ' + url + '...')
      urlExists(url, (_, exists) => {
        // Handle result
        
        if (isTimeout) {
          return false
        }
        //process.stdout.write(exists)
        console.log(exists, url)
        
        resolve(exists)
        isChecked = true
      })
    })
  })
}

const isXML = async function (url) {
  return await NodeCacheSQLite.get('is-xml', url, async () => {
    if (url.startsWith('http://gphonefans.net/forum.php?mod=rss')
            || url.startsWith('http://www.apprcn.com/feed')) {
      return false
    }

    console.log('Check XML ' + url + ' ...')
    let xml = await HtmlLoader(url, 24 * 60 * 60 * 1000)

    if (!xml.startsWith('<?xml')) {
      console.log(false)
      return false
    }
    if (xml.startsWith('<!DOCTYPE html>')) {
      return false
    }
    console.log(true)
    return true
  })
}

module.exports = OPMLParser