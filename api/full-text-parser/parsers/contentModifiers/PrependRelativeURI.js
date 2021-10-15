const cheerio = require('cheerio')

module.exports = function (html, url) {
  let origin
  try {
    let urlObject = new URL(url)
    origin = urlObject.origin
  }
  catch (e) {
    console.error(e)
    return html
  }
  
  
  // -------------
  
  let $
  if (typeof(html) === 'object' || typeof(html) === 'function') {
    $ = html
  }
  else {
    $ = cheerio.load('<div>' + html + '</div>'); // 載入 body
  }
  
  // -------------------
  
  let imgList = $('img[src^="/"]:not([src^="//"])')
  let aList = $('a[href^="/"]:not([href^="//"])')
  if (imgList.length === 0 && aList.length === 0) {
    return html
  }
  
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    let src = img.attr('src')
    src = origin + src
    img.attr('src', src)
  }
  
  for (let i = 0; i < aList.length; i++) {
    let aTag = aList.eq(i)
    let href = aTag.attr('href')
    href = origin + href
    aTag.attr('href', href)
  }
  
  // ---------------------
  
  //return $.html()
  return $
}