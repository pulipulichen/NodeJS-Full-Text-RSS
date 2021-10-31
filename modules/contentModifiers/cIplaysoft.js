const cheerio = require('cheerio')

const cIplaysoft = function (content) {
  const $ = cheerio.load(content)
  
  $('div[style="margin:40px auto 50px auto;overflow:hidden;"]').remove()
  $('ul#link1111').remove()
  
  content = $.html().trim()
  return content
}

module.exports = cIplaysoft