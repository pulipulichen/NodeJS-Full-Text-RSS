const cheerio = require('cheerio')

const cSoft4fun = function (content) {
  const $ = cheerio.load(content)
  
  
  $('div[style="text-align:center;margin: 0 auto;background-color: #EEEE;color: gray;font-size: 12px;padding: 15px;clear: both;display: inline-table;width: 95%;"]').remove()
  
  
  let imgList = $(`img[loading="lazy"][data-lazy-src]`)
  //console.log(imgList.length)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    let src = img.attr('data-lazy-src')
    if (src.indexOf('?resize=') > -1) {
      src = src.slice(0, src.indexOf('?resize='))
    }
    //console.log(src)
    img.attr('src', src)
    img.removeAttr('style')
    img.removeAttr('loading')
    img.removeAttr('data-recalc-dims')
    img.removeAttr('data-lazy-src')
    img.removeAttr('class')
    img.removeAttr('srcset')
    
    img.css('display', 'block')
  }
  
  
  // --------------
  content = $('body').html()
  
  return content
}

module.exports = cSoft4fun