const HtmlLoader = require('./HtmlLoader.js')
const PuppeterHTMLLoader = require('./PuppeterHTMLLoader.js')

const cheerio = require('cheerio')

const NodeCacheSQLite = require('./../cache/node-cache-sqlite.js')

const XMLLoader = async function (url, cacheMS) {
  return await NodeCacheSQLite.get('xml-loader', url, async () => {
    
    let feedXML = await HtmlLoader(url, cacheMS)
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
        feedXML = $('rss:first').prop('outerHTML')
      }

      //console.log(feedXML)
    }

    return feedXML
  }, cacheMS)
}

module.exports = XMLLoader
  