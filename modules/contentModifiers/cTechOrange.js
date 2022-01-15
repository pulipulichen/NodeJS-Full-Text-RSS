const cheerio = require('cheerio')
//const StripHTML = require('./../../api/lib/stringUtils/StripHTML.js')

const cTechbang = function (content) {
  const $ = cheerio.load(content)
  
  let thumb = $('.entry-thumb.single-entry-thumb:first')
  let body = $('.single-content__wrap:first')

  if (body.children().length === 1) {
    body = body.children().eq(0)
  }

  console.log(thumb.length, body.length)
  if (thumb.length > 0 && body.length > 0) {
    body.prepend(thumb)
    content = body.html().trim()
  }
  
  return content
}

module.exports = cTechbang