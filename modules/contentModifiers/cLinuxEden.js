const cheerio = require('cheerio')

let needle = `
<span class="f2">※ 發信站: 批踢踢實業坊(ptt.cc), 來自: `

const cLinuxEden = function (content) {
  const $ = cheerio.load(content)
  $('img[src="http://www.linuxeden.com/wp-content/uploads/2021/10/topicopensource.png"]').remove()
  content = $.html().trim()
  return content
}

module.exports = cLinuxEden