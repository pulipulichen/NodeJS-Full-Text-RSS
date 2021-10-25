const cheerio = require('cheerio')

let needle = `
<span class="f2">※ 發信站: 批踢踢實業坊(ptt.cc), 來自: `

const cTongliNewletter = function (content) {
  const $ = cheerio.load(content)
  $('img[src$="/epaper/logo.gif"]').remove()
  
  $('div > p:contains("發報日期：2")').remove()
  
  $('a[href^="#"]').remove()
  content = $.html().trim()
  return content
}

module.exports = cTongliNewletter