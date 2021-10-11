const cheerio = require('cheerio')

function isComment(index, node) {
  return node.type === 'comment'
}
  
const RemoveComments = function (html) {
  
  //console.log(html)
  
  let $
  if (typeof(html) === 'object' || typeof(html) === 'function') {
    $ = html
  }
  else {
    $ = cheerio.load('<div>' + html + '</div>'); // 載入 body
  }
  
  // -------------------
  
  $.root().find('*').contents().filter(isComment).remove();
  
  return $
}

module.exports = RemoveComments