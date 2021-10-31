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
  
  // https://www.kocpc.com.tw/archives/409477
  // https://wuangus.cc/go.php?url=https://useful.tools/karaoke
  $('a[href^="https://wuangus.cc/go.php?url="]').each(function (){
    let a = $(this)
    let href = a.attr('href')
    href = href.slice(href.indexOf('?url=') + 5)
    a.attr('href', href)
  })
  
  
  //return $.html()
  return $
}