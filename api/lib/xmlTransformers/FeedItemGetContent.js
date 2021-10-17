const decode = require('html-entities').decode

const FeedItemGetContent = function (item) {
  let element = item.find('description:first')
  
  if (element.length === 1) {
    return decode(element.text())
  } 
  
  element = item.find('content:first')
  if (element.length === 1) {
    return decode(element.text())
  }
  
  element = item.find('media\\:description')
  if (element.length === 1) {
    return element.text()
  }
  
  throw Error('Content is not found. ', item.html())
}

module.exports = FeedItemGetContent