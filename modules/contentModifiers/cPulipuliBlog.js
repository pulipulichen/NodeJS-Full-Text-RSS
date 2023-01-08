// https://blog.pulipuli.info/feeds/posts/default
const cheerio = require('cheerio')

const cPulipuliBlog = function (content, code, $) {

  let url = $('link[rel="alternate"][type="text/html"][href]:first').attr('href')

  // -------------

  let container = cheerio.load(content);
  let text = []
  let pList = container('p')
  for (let i = 0; i < pList.length; i++) {
    let p = pList.eq(i)
    let t = p.text().trim()
    
    text.push(t)
    
    if (text.join('').length > 50) {
      text.push('繼續閱讀 ⇨' + url)
      break
    }
  }
  
  // -------------------
  /*
  let categories = $('category[scheme="http://www.blogger.com/atom/ns#"][term]')
  let terms = []
  for (let i = 0; i < categories.length; i) {
    let term = categories[i].attr('term')
    if (term.indexOf('/') > -1) {
      term = term.slice(term.lastIndexOf('/') + 1).trim()
    }
    terms.push(term)
  }

  terms = terms.filter((v, i, a) => a.indexOf(v) === i)

  if (terms.length > 0) {
    text.push('#' + terms.join(' #'))
  }
  */

  // -------------------

  text = text.filter(t => t.trim() !== '')

  text = text.join('\n<br />\n<br />')
  //console.log(text)

  // text = '<textarea>' + $.html() + '</textarea>' + text
  
  return text
}

module.exports = cPulipuliBlog