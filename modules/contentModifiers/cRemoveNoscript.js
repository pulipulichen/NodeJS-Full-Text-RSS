const cheerio = require('cheerio')

const cRemoveNoscript = function (html) {
  
  const $ = cheerio.load(html)
  $('noscript').remove()
  
  // --------------
  content = $('body').html()
  
  return content
}

module.exports = cRemoveNoscript