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
      break
    }
  }
  
  text = text.join('\n\n')
  console.log(text)
  
  return text
}

module.exports = cPulipuliBlog