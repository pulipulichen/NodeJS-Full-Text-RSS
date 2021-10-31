const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const FeedItemGetLink = require('./../../api/lib/xmlTransformers/FeedItemGetLink.js')
const FeedItemSetContent = require('./../../api/lib/xmlTransformers/FeedItemSetContent.js')
const FeedItemGetContent = require('./../../api/lib/xmlTransformers/FeedItemGetContent.js')

const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')

const xDefaultRemoveTitle = require('./xDefault/xDefaultRemoveTitle.js')

const needToLoadFullText = 5000

const xDefault = async function ($, moduleCodesString) {
  //console.log('xDefault')
  //console.log($.html())
  await FeedItemEach($, async (item, i) => {
    if (FeedItemGetContent(item).length > needToLoadFullText) {
      return true
    }
    
    
    let link = FeedItemGetLink(item)
    
    let {content} = await fullTextParser(link, moduleCodesString)
    console.log('xDefault', i, link, content.length, content.slice(-200))
    let title = item.find('title:first').text().trim()
    content = xDefaultRemoveTitle(content, title)
    //console.log(i, '<<<', content, '>>>')
    
    //if (i === 4) {
      //content = content.slice(content.indexOf('<p'), content.indexOf('</p>') + 3)
      //content = content.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
      FeedItemSetContent(item, content)
      //console.log(i, '<<<', content, '>>>')
    //}
    
  })
  
  //console.log('ok')
  
  return $
}

module.exports = xDefault