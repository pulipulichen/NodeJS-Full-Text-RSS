const HtmlLoader = require('./HtmlLoader.js')
const PuppeterHTMLLoader = require('./PuppeterHTMLLoader.js')

const cheerio = require('cheerio')

const XMLLoader = async function (url, cacheMS) {
  let feedXML = await HtmlLoader(url, cacheMS)
  let $ = cheerio.load(feedXML)
  //console.log('~~~', feedXML, '~~~')
  if ($('html').length > 0) {
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
}

module.exports = XMLLoader
  