const encode = require('html-entities').encode

const FeedItemSetContent = function (item, content) {
  if (!content || content.trim() === '') {
    return false
  }
  
  let element = item.find('description:first')
  
  if (element.length === 1) {
    if (!content.startsWith('<![CDATA[')) {
      content = '<![CDATA[' + content
    }
    if (!content.endsWith(']]>')) {
      content = content + ']]>'
    }
    
    element.text(content)
  } 
  
  element = item.find('content:first')
  if (element.length === 1) {
    content = encode(content)
    element.text(content)
  }
}

module.exports = FeedItemSetContent