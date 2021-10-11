const cheerio = require('cheerio')

module.exports = function (html) {
  let $
  if (typeof(html) === 'object') {
    $ = html
  }
  else {
    $ = cheerio.load('<div>' + html + '</div>'); // 載入 body
  }
  
  // -------------------
  
  let imgList = $('img[src^="//"]')
  let aList = $('a[href^="//"]')
  if (imgList.length === 0 && aList.length === 0) {
    return html
  }
  
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    let src = img.attr('src')
    src = 'https:' + src
    img.attr('src', src)
  }
  
  for (let i = 0; i < aList.length; i++) {
    let aTag = aList.eq(i)
    let href = aTag.attr('href')
    href = 'https:' + href
    aTag.attr('href', href)
  }
  
  // ---------------------
  
  return $.html()
}