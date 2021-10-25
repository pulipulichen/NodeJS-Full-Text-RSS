const cheerio = require('cheerio')

const cLinuxEden = function (content) {
  const $ = cheerio.load(content)
  let imageList = $('img[src^="https://"]')
  for (let i = 0; i < imageList.length; i++) {
    let img = imageList.eq(i)
    let src = img.attr('src')
    src = 'http' + src.slice(5)
    img.attr('src', src)
  }
  
  content = $.html().trim()
  return content
}

module.exports = cLinuxEden