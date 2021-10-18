const encode = require('html-entities').encode

const FeedItemSetContent = function (item, content) {
  if (!content || content.trim() === '') {
    return false
  }
  
  let element = item.find('entry > description:first')
  if (element.length === 1) {
    if (!content.startsWith('<![CDATA[')) {
      content = '<![CDATA[' + content
    }
    if (!content.endsWith(']]>')) {
      content = content + ']]>'
    }
    
    console.log(1)
    return element.text(content)
  } 
  
  // -------------
  
  element = item.find('entry > content:first')
  if (element.length === 1) {
    content = encode(content)
    console.log(2)
    return element.text(content)
  }
  
  // -------------
  
  element = item.find('media\\:description:first')
  if (element.length === 1) {
    //console.log(3, content)
    if (!content.startsWith('<![CDATA[')) {
      content = '<![CDATA[' + content
    }
    if (!content.endsWith(']]>')) {
      content = content + ']]>'
    }
    
    return element.text(content)
  }
  
  //console.log(item.html())
  throw Error('selector is not found')
}

module.exports = FeedItemSetContent