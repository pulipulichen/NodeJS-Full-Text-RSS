const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const FeedItemGetLink = require('./../../api/lib/xmlTransformers/FeedItemGetLink.js')
const FeedItemSetContent = require('./../../api/lib/xmlTransformers/FeedItemSetContent.js')

const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')

const xPTT = async function ($, moduleCodesString) {
  await FeedItemEach($, async (item, i) => {
    //console.log(i, item.find('title').text())
    //item.remove()
    
    let match = await ModuleManager(item, moduleCodesString, 'f')
    if (match === false) {
      item.remove()
    }
    
    let link = FeedItemGetLink(item)
    let {content} = await fullTextParser(link, moduleCodesString)
    console.log(i, content)
    FeedItemSetContent(item, content)
  })
  
  return $
}

module.exports = xPTT