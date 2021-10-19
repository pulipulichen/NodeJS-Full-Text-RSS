const cheerio = require('cheerio')

const xDefaultRemoveTitle = function (content, title) {
  const $ = cheerio.load(`<div>${content}</div>`)
  
  const children = $('div:first').contents()
  for (let i = 0; i < children.length; i++) {
    let child = children.eq(i)
    if (child.prop('tagName') === 'BR') {
      child.remove()
      continue
    }
    
    let text = child.text().trim()
    if (text !== '') {
      if (text === title) {
        child.remove()
      }
      
      break
    }
  }
  
  return $('body').html()
}

module.exports = xDefaultRemoveTitle

