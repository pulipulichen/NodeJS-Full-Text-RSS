const cheerio = require('cheerio')

const RemoveShare = async function (html, url) {
  //console.log(html)
  
  let $
  if (typeof(html) === 'object' || typeof(html) === 'function') {
    $ = html
  }
  else {
    $ = cheerio.load('<div>' + html + '</div>'); // 載入 body
  }
  
  // -------------------
  
  let removeClassNameList = [
    '.js-sticky-sidebar',
    '.ceris-mobile-share-socials'
  ]

  removeClassNameList.forEach(cn => {
      $(cn).remove()
  })

  // ------------------------------
  
  return $
}

module.exports = RemoveShare