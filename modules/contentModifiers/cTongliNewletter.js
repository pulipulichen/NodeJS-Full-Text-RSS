const cheerio = require('cheerio')

const cTongliNewletter = function (content) {
  const $ = cheerio.load(content)
  $('img[src$="/epaper/logo.gif"]').remove()
  
  $('div > p:contains("發報日期：2")').remove()
  
  $('a[href^="#"]').remove()
  content = $.html().trim()
  return content
}

module.exports = cTongliNewletter