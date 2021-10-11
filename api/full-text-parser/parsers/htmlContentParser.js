
const cheerio = require('cheerio')

const htmlContentParser = async function (html, modules) {
  const $ = cheerio.load(html); // 載入 body
  
  let selectors = [
    'article:first'
  ]
  
  for (let i = 0; i < selectors.length; i++) {
    let element = $(selectors[i])
    if (element.length === 0) {
      continue
    }
    
    return element.html().trim()
  }
}

module.exports = htmlContentParser