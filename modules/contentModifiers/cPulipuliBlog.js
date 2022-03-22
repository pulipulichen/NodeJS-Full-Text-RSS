const cheerio = require('cheerio')

const cPulipuliBlog = function (content) {
  let container = cheerio.load(content);
  let text = container('p').eq(0).text()
  
  console.log(text)
  
  return text
}

module.exports = cPulipuliBlog