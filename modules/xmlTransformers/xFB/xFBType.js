//const htmlLoader = require('./../../../api/full-text-parser/html-loader/htmlLoader.js')

const htmlLoader = require('./../../../api/lib/HtmlLoader/PuppeterHTMLLoader.js')

const cheerio = require('cheerio')

const xFBLinkParser = require('./xFBLinkParser.js')
const xFBIsVideo = require('./xFBIsVideo.js')

const xFBType = async function (item, i) {
  let link = item.find('link:first').text().trim()
  
  let html = await htmlLoader(link)
  
  const $ = cheerio.load(html) // 載入 body
  let outputURL = xFBLinkParser($)
  
  if (outputURL) {
    return outputURL
  }
  
  // ------------------
  if (xFBIsVideo($)) {
    return 'video'
  }
  
  return 'post'
}

module.exports = xFBType