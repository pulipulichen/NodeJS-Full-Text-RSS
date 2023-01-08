// https://blog.pulipuli.info/feeds/posts/default
const cheerio = require('cheerio')

// const textLimit = 5000
const textLimit = 1000

const cPulipuliBlog = function (content, code, $) {
  

  let container = cheerio.load(content);
  text = container('title').text()

  return text
}

module.exports = cPulipuliBlog