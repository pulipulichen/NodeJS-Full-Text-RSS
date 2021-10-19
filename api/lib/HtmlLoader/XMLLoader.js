const HtmlLoader = require('./HtmlLoader.js')
const PuppeterHTMLLoader = require('./PuppeterHTMLLoader.js')

const XMLLoader = async function (url, cacheMS) {
  let feedXML = await HtmlLoader(url, cacheMS)
  //if (feedXML.indexOf('<html') > -1) {
    //console.log('go')
    //let feedXML = await PuppeterHTMLLoader(url, 1)
    //console.log(feedXML)
  //}
  
  return feedXML
}

module.exports = XMLLoader
  