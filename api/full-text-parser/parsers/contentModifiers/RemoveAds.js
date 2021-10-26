const cheerio = require('cheerio')

module.exports = function (html) {
  let $
  if (typeof(html) === 'object' || typeof(html) === 'function') {
    $ = html
  }
  else {
    $ = cheerio.load('<div>' + html + '</div>'); // 載入 body
  }
  
  // -------------------
  
  $('.ads-bg').remove()
  $('.ad-wrap').remove()
  
  //return $.html()
  return $
}