const cheerio = require('cheerio')

const cPTTRemoveMetaline = require('./cPTT/cPTTRemoveMetaline.js')
const cPTTLoadImgur = require('./cPTT/cPTTLoadImgur.js')
const cPTTMergeLines = require('./cPTT/cPTTMergeLines.js')
const cPTTRemoveCache = require('./cPTT/cPTTRemoveCache.js')

const cPTT = function (content) {
  const $ = cheerio.load(content)
  cPTTRemoveMetaline($)
  
  // ---------------------
  // 要讓圖片能夠載入
  
  cPTTLoadImgur($)
  cPTTRemoveCache($)

  // --------------
  content = cPTTMergeLines($)
  
  return content
}

module.exports = cPTT