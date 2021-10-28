const cheerio = require('cheerio')

const RemoveScripts = function (html) {
  
  //console.log(html)
  
  let $
  if (typeof(html) === 'object' || typeof(html) === 'function') {
    $ = html
  }
  else {
    $ = cheerio.load('<div>' + html + '</div>'); // 載入 body
  }
  
  // -------------------
  
  $.root().find('script').remove();
  
  return $
}

module.exports = RemoveScripts