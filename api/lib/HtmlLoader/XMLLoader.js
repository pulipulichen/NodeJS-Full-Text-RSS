const HtmlLoader = require('./HtmlLoader.js')
const PuppeterHTMLLoader = require('./PuppeterHTMLLoader.js')

const cheerio = require('cheerio')

const NodeCacheSQLite = require('./../cache/node-cache-sqlite.js')
const decode = require('html-entities').decode



const XMLLoader = async function (url, cacheMS) {
  //console.log('XMLLoader')
  return await NodeCacheSQLite.get('xml-loader', url, async () => {
    
    let feedXML
    try {
      feedXML = await HtmlLoader(url, cacheMS)
    }
    catch (e) {
      console.error('XMLLoader Error ' + e + ' ' + url)
      feedXML = await PuppeterHTMLLoader(url, cacheMS)
      //console.log(feedXML)
    }
    
    // 移除非UTF8的內容
    feedXML = feedXML.replace(/([\u0300-\u036f]|[\u001d])/g, ' ');

    let $ = cheerio.load(feedXML)
    //console.log('~~~', feedXML, '~~~')
    //console.log('need puppeter', ($('rss').length === 0
    //        && $('atom').length === 0
    //        && $('feed').length === 0))
    if ($('rss').length === 0
            && $('atom').length === 0
            && $('feed').length === 0) {
      //console.log('go')
      feedXML = await PuppeterHTMLLoader(url, 1)
      //console.log('***', feedXML, '***')
      $ = cheerio.load(feedXML)

      if ($('rss:first').length === 1) {
        //feedXML = $('rss:first').prop('outerHTML')
        feedXML = feedXML.slice(feedXML.indexOf('<rss'), feedXML.indexOf('</rss>') + 6)
      }
      
      if (feedXML.startsWith('<pre') && feedXML.endsWith('</pre>')) {
        feedXML = feedXML.slice(feedXML.indexOf('>') + 1, - 6).trim()
        feedXML = decode(feedXML)
        
        //feedXML = decode(feedXML)
        //feedXML = feedXML.split('&nbsp;').join(' ')
        //console.log(feedXML.split('&nbsp;').length)
        feedXML = feedXML.split('&nbsp;').join(' ')
        //feedXML = feedXML.split('&lt;').join('<')
      }

      //console.log('============')
      //console.log(feedXML)
      //console.log('============')
    }

    return feedXML
  }, 0)
}

module.exports = XMLLoader
  