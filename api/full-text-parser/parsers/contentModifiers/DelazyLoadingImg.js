const cheerio = require('cheerio')

const DelazyLoadingImg = function (html) {
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
  }
  
  // ------------------------------
  
  return $
}

module.exports = DelazyLoadingImg