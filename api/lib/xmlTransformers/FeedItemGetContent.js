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
}

module.exports = FeedItemGetContent