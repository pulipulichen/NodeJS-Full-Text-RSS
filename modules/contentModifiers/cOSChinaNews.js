const cheerio = require('cheerio')

const cOSChinaNews = function (content) {
  const $ = cheerio.load(content)
  $('.ad-wrap').remove()
  
  // --------------
  content = $('body').html()
  
  return content
}

module.exports = cOSChinaNews