const cheerio = require('cheerio')

const cLinuxEden = function (content) {
  const $ = cheerio.load(content)
  $('img[src="http://www.linuxeden.com/wp-content/uploads/2021/10/topicopensource.png"]').remove()
  content = $.html().trim()
  return content
}

module.exports = cLinuxEden