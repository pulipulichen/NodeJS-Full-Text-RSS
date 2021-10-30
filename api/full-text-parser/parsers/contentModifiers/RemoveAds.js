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
  $('.newsletter-subscribe').remove()
  $('.adsbygoogle').remove()
  $('.shareaholic-canvas').remove()
  $('.addtoany_share_save_container').remove()
  
  $('.extcsscode').remove()
  
  
  //return $.html()
  return $
}