const encode = require('html-entities').encode
const decode = require('html-entities').decode

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
    
    //console.log(1)
    return element.text(content)
  } 
  
  element = item.find('item > description:first')
  if (element.length === 1) {
    content = decode(content)
    
    while (content.indexOf('&nbsp;') > -1) {
      content = content.split('&nbsp;').join(' ')
    }
    
    if (!content.startsWith('<![CDATA[')) {
      content = '<![CDATA[' + content
    }
    if (!content.endsWith(']]>')) {
      content = content + ']]>'
    }
    
    //console.log(1)
    return element.text(content)
  } 
  
  // -------------
  
  element = item.find('entry > content:first')
  if (element.length === 1) {
    content = encode(content)
    //console.log(2)
    return element.text(content)
  }
  
  // -------------
  
  element = item.find('media\\:description:first')
  if (element.length === 1) {
    //console.log(3, content)
    /*
    if (!content.startsWith('<![CDATA[')) {
      content = '<![CDATA[' + content
    }
    if (!content.endsWith(']]>')) {
      content = content + ']]>'
    }
    
    return element.text(content)
    */
    return element.text(encode(content))
  }
  
  //console.log(item.html())
  //throw Error('selector is not found')
  //console.log('[INFO] FeedItemSetContent: content selector is not found.')
  
  content = encode(content)
  item.append(`<content>${content}</content>`)
}

module.exports = FeedItemSetContent