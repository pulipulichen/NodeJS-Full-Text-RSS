//const cheerio = require('cheerio')

const cNoScript = function (html) {
  
  if (html.indexOf('<noscript>') > -1 && html.indexOf('</noscript>') > -1) {
    html = html.slice(html.indexOf('<noscript>') + 10 , html.indexOf('</noscript>'))
  }
  
  return html
}

module.exports = cNoScript