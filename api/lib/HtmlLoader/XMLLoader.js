const HtmlLoader = require('./HtmlLoader.js')
const PuppeterHTMLLoader = require('./PuppeterHTMLLoader.js')

const XMLLoader = async function (url, cacheMS) {
  let feedXML = await HtmlLoader(url, cacheMS)
  //console.log('~~~', feedXML, '~~~')
  if (feedXML.indexOf('<html') > -1) {
    //console.log('go')
    feedXML = await PuppeterHTMLLoader(url, 1)
    //console.log('***', feedXML, '***')
    if (feedXML.indexOf('<rss') > -1) {
      feedXML = feedXML.slice(feedXML.indexOf('<rss'))
    }
    
    if (feedXML.indexOf('</rss>') > -1) {
      feedXML = feedXML.slice(0, feedXML.indexOf('</rss>') + 6)
    }
    
    //console.log(feedXML)
  }
  
  return feedXML
}

module.exports = XMLLoader
  