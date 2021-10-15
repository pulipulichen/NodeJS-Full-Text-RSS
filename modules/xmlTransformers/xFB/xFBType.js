//const htmlLoader = require('./../../../api/full-text-parser/html-loader/htmlLoader.js')

const htmlLoader = require('./../../../api/lib/HtmlLoader/PuppeterHTMLLoader.js')

const cheerio = require('cheerio')

const xFBLinkParser = require('./xFBLinkParser.js')
const xFBIsVideo = require('./xFBIsVideo.js')

const FeedItemGetLink = require('./../../../api/lib/xmlTransformers/FeedItemGetLink.js')

const xFBType = async function (item, moduleCodesString) {
  //let link = item.find('link:first').text().trim()
  let link = FeedItemGetLink(item)
  
  if (link.startsWith('https://www.facebook.com/')) {
    link = 'https://m.facebook.com/' + link.slice(25)
  }
  
  //console.log(link)
  
  let html = await htmlLoader(link)
  
  const $ = cheerio.load(html) // 載入 body
  let outputURL = xFBLinkParser($, moduleCodesString)
  
  if (outputURL) {
    if (outputURL.startsWith('https://m.facebook.com/')) {
      outputURL = 'https://www.facebook.com/' + outputURL.slice(23)
    }
    
    return outputURL
  }
  
  // ------------------
  if (xFBIsVideo($)) {
    return 'video'
  }
  
  return 'post'
}

module.exports = xFBType