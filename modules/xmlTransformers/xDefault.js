const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const FeedItemGetLink = require('./../../api/lib/xmlTransformers/FeedItemGetLink.js')
const FeedItemSetContent = require('./../../api/lib/xmlTransformers/FeedItemSetContent.js')

const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')

const xDefault = async function ($, moduleCodesString) {
  await FeedItemEach($, async (item, i) => {
    
    let link = FeedItemGetLink(item)
    //console.log('xDefault', link)
    let {content} = await fullTextParser(link, moduleCodesString)
    //console.log(i, content)
    FeedItemSetContent(item, content)
  })
  
  return $
}

module.exports = xDefault