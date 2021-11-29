const cheerio = require('cheerio')

const DelazyLoadingImg = function (html, url) {
  //console.log(html)
  
  let $
  if (typeof(html) === 'object' || typeof(html) === 'function') {
    $ = html
  }
  else {
    $ = cheerio.load('<div>' + html + '</div>'); // 載入 body
  }
  
  // -------------------
  
  let imgList = $(`img[src$=".tmp"][data-original]`)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    img.attr('src', img.attr('data-original'))
    img.removeAttr('srcset')
  }
  
  // -------------------
  
  imgList = $(`img[src$="loading.gif"][data-original]`)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    img.attr('src', img.attr('data-original'))
    img.removeAttr('srcset')
  }
  
  // -------------------
  
  imgList = $(`img.lazyload[data-src]`)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    img.attr('src', img.attr('data-src'))
    img.removeAttr('srcset')
  }
  
  // -------------------
  
  imgList = $(`img.lazy[data-src]`)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    img.attr('src', img.attr('data-src'))
    img.removeAttr('srcset')
  }
  
  
  // -------------------
  
  imgList = $(`img[src$="/loading.svg"][data-src]`)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    let src = img.attr('data-src')
    if (src.startsWith('/')) {
      let urlObject = new URL(url)
      src = urlObject.origin + src
    }
    img.attr('src', src)
    img.removeAttr('srcset')
  }
  
  // -------------------
  // 20211130-0007 
  
  /*
  imgList = $(`img[src^="data:image/svg+xml,"][data-lazy-src][data-orig-file]`)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    let src = img.attr('data-orig-file')
    if (src.startsWith('/')) {
      let urlObject = new URL(url)
      src = urlObject.origin + src
    }
    img.attr('src', src)
    img.removeAttr('srcset')
  }
  */
  
  let figures = $(`figure.wp-block-image`)
  for (let i = 0; i < figures.length; i++) {
    let figure = figures.eq(i)
    let noscript = figure.children('noscript')
    figure.after(noscript.text())
    figure.remove()
  }
  
  // ------------------------------
  
  return $
}

module.exports = DelazyLoadingImg