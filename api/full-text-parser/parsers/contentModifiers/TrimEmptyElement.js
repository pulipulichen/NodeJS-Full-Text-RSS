const cheerio = require('cheerio')

const TrimEmptyElement = function (html) {
  //console.log(html)
  
  let $
  if (typeof(html) === 'object' || typeof(html) === 'function') {
    $ = html
  }
  else {
    $ = cheerio.load('<div>' + html + '</div>'); // 載入 body
  }
  
  // -------------------
  
  let children = $("body > div > *")
  for (let i = 0; i < children.length; i++) {
    let child = children.eq(i)
    let tagName = child.prop('tagName')
    
    if (tagName === 'IMG' 
            || tagName === 'BR'
            || child.find('img:first').length > 0) {
      continue
    }
    
    if (child.text().trim() === '') {
      child.remove()
    }
    else {
      break
    }
  }
  
  // -----------------------
  
  children = $("body > div > *")
  for (let i = children.length - 1; i > -1; i--) {
    let child = children.eq(i)
    if (child.find('img:first').length > 0) {
      continue
    }
    let tagName = child.prop('tagName')
    if (tagName === 'BR') {
      continue
    }
    
    
    if (child.text().trim() === '') {
      child.remove()
    }
    else {
      break
    }
  }
  
  // ------------------------------
  
  return $
}

module.exports = TrimEmptyElement