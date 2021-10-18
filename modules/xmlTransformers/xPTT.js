const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const FeedItemGetLink = require('./../../api/lib/xmlTransformers/FeedItemGetLink.js')
const FeedItemGetContent = require('./../../api/lib/xmlTransformers/FeedItemGetContent.js')
const FeedItemSetContent = require('./../../api/lib/xmlTransformers/FeedItemSetContent.js')

const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')

const xTwitter = async function ($, moduleCodesString) {
  await FeedItemEach($, async (item, i) => {
    //console.log(i, item.find('title').text())
    //item.remove()
    
    //let link = FeedItemGetLink(item)
    //let {content} = await fullTextParser(link, moduleCodesString)
    //console.log(i, content)
    //FeedItemSetContent(item, content)
    
    let title = item.find('title:first').text().trim()
    if (title.endsWith('...')) {
      title = title.slice(0, -3)
    }
    
    let content = FeedItemGetContent(item)
    
    if (content.startsWith(title)) {
      console.log(title)
    }
    
  })
  
  return $
}

module.exports = xTwitter