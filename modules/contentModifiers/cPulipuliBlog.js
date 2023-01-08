// https://blog.pulipuli.info/feeds/posts/default
const cheerio = require('cheerio')

const cPulipuliBlog = function (content, code, $) {

  // if (typeof($.find) === 'function') {
  //   $ = $.find
  // }
  // let url = $('link[rel="alternate"][type="text/html"][href]:first').attr('href')
  let url = ''
  try {
    url = $.find('link[rel="alternate"][type="text/html"][href]:first').attr('href')
  }
  catch (e) {
    url = e
  }


  // -------------

  let container = cheerio.load(content);
  let text = []
  let pList = container('p')
  let isOverflowed = false
  for (let i = 0; i < pList.length; i++) {
    let p = pList.eq(i)
    let t = p.text().trim()
    
    text.push(t)
    
    if (text.join('').length > 50) {
      text.push('繼續閱讀 ⇨ ' + url)
      isOverflowed = true
      break
    }
  }

  if (!isOverflowed) {
    text.push('看看網頁版全文 ⇨ ' + url)
  }
  
  // -------------------
  
  let categories = []
  try {
    // categories = $.find('link[rel="alternate"][type="text/html"][href]:first').attr('href')
    let html = $.html()
    html = html.slice(0, html.indexOf('<title '))
    let parts = html.split(`<category scheme="http://www.blogger.com/atom/ns#" term="`)
    for (let i = 1; i < parts.length; i++) {
      let term = parts[i].slice(0, parts[i].indexOf('"'))
      if (term.indexOf('/') > -1) {
        term = term.slice(term.lastIndexOf('/') + 1).trim()
      } 
      categories.push(term)
    }

    categories = categories.filter((v, i, a) => a.indexOf(v) === i)

    if (categories.length > 0) {
      text.push('#' + categories.join(' #'))
    }
  }
  catch (e) {
    // categories = e.toString()
  }

  // ------------
  
  let imgSrc = ''
  let img = $.find('img')
  // imgSrc = img.eq(0).attr('src')
  // imgSrc = img.length
  // let img = $.find('img:first').parent()
  text.unshift(imgSrc)

  // ------------
  
  // try {
  //   let categories = $.find('category[scheme="http://www.blogger.com/atom/ns#"][term]')
  //   let terms = []
  //   text.push(categories.length)
  // }
  // catch (e) {
  //   text.push(e)
  // }
    
  // for (let i = 0; i < categories.length; i) {
  //   let term = categories[i].attr('term')
  //   if (term.indexOf('/') > -1) {
  //     term = term.slice(term.lastIndexOf('/') + 1).trim()
  //   }
  //   terms.push(term)
  // }

  // terms = terms.filter((v, i, a) => a.indexOf(v) === i)

  // if (terms.length > 0) {
  //   text.push('#' + terms.join(' #'))
  // }
  
  // -------------------

  text = text.filter(t => t.trim() !== '')

  text = text.join('\n<br />\n<br />')
  //console.log(text)

  // text = '<textarea>' + $.html() + '</textarea>' + text
  
  return text
}

module.exports = cPulipuliBlog