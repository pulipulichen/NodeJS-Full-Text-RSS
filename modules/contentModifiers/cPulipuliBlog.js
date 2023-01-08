// https://blog.pulipuli.info/feeds/posts/default
const cheerio = require('cheerio')

const cPulipuliBlog = function (content) {
  let container = cheerio.load(content);
  let text = []
  let pList = container('p')
  for (let i = 0; i < pList.length; i++) {
    let p = pList.eq(i)
    let t = p.text().trim()
    
    text.push(t)
    
    if (text.join('').length > 50) {
      text.push('繼續閱讀 ⇨')
      break
    }
  }
  
  text = text.join('\n<br />\n<br />')
  //console.log(text)
  
  return text
}

module.exports = cPulipuliBlog