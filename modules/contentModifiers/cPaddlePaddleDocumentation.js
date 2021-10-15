const cheerio = require('cheerio')

const cPaddlePaddleDocumentation = function (content) {
  const $ = cheerio.load(content)
  $('h1:first').remove()
  $('a.headerlink').remove()
  
  // --------------
  content = $('body').html()
  
  return content
}

module.exports = cPaddlePaddleDocumentation