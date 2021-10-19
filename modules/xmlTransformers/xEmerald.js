//const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
//const FeedItemGetLink = require('./../../api/lib/xmlTransformers/FeedItemGetLink.js')
//const FeedItemSetContent = require('./../../api/lib/xmlTransformers/FeedItemSetContent.js')
//
//const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')
//
//const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')

const linkifyHtml = require('linkify-html')

const formatDescription = function ($) {
  let itemList = $('item[rdf\\:about]')
  
  //console.log(itemList.length)
  
  for (let i = 0; i < itemList.length; i++) {
    let item = itemList.eq(i)
    
    let contentEncoded = item.find('content\\:encoded').text()
    contentEncoded = contentEncoded.slice(contentEncoded.indexOf('</a>') + 4)
    
    contentEncoded = linkifyHtml(contentEncoded)
    contentEncoded = contentEncoded.trim()
    
    if (contentEncoded.indexOf('</i>') > -1) {
      contentEncoded = contentEncoded.slice(0, contentEncoded.indexOf('</i>') + 4)
        + '<br /><br /><hr />' + contentEncoded.slice(contentEncoded.indexOf('</i>') + 4)

      contentEncoded = contentEncoded.slice(0, contentEncoded.indexOf('<i>'))
        + '<br />'
        + contentEncoded.slice(contentEncoded.indexOf('<i>'))
    }
    
    while (contentEncoded.startsWith('<br>')) {
      contentEncoded = contentEncoded.slice(4).trim()
    }
    while (contentEncoded.endsWith('<br>')) {
      contentEncoded = contentEncoded.slice(0, -4).trim()
    }
    
    item.find('description').text(`<![CDATA[${contentEncoded}]]>`)
  }
}

const xEmerald = async function ($, moduleCodesString) {
//  await FeedItemEach($, async (item, i) => {
//    /*
//    let link = FeedItemGetLink(item)
//    //console.log('xDefault', link)
//    let {content} = await fullTextParser(link, moduleCodesString)
//    //console.log(i, content)
//    FeedItemSetContent(item, content)
//     */
//    
//  })
  formatDescription($)
  
  
  return $
}

module.exports = xEmerald