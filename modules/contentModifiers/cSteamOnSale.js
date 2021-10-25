const cheerio = require('cheerio')

const cSteamOnSale = function (content) {
  //console.log(content)
  //console.log(content.indexOf('p-80'))
  const $ = cheerio.load(content)
  $('img[src$="/email/logo.png"]').remove()
  $('td[style]').removeAttr('style')
  $('span.link.c-white').remove()
  $('.btn-18.l-white').remove()
  
  let table = $('table[width="775"] table table:first')
  //console.log(table.length)
  if (table.length === 0) {
    table = $
  }
  content = table.html().trim()
  return content
}

module.exports = cSteamOnSale