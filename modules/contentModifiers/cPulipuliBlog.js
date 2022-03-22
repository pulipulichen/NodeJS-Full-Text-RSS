const cheerio = require('cheerio')

const cPulipuliBlog = function (content) {
  let container = cheerio.load(content);
  let text = container('p').eq(0).text()
  
  return text
}

module.exports = cPulipuliBlog