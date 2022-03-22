const cheerio = require('cheerio')

const cPulipuliBlog = function (content) {
  let container = cheerio.load(content);
  let text = container('p:first').text()
  
  return text
}

module.exports = cPulipuliBlog