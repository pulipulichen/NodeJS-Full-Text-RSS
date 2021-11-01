const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const FeedItemGetLink = require('./../../api/lib/xmlTransformers/FeedItemGetLink.js')
const FeedItemGetContent = require('./../../api/lib/xmlTransformers/FeedItemGetContent.js')
const FeedItemSetContent = require('./../../api/lib/xmlTransformers/FeedItemSetContent.js')

const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')
const PuppeterHTMLLoader = require('./../../api/lib/HtmlLoader/PuppeterHTMLLoader.js')

const cheerio = require('cheerio')

const xLinuxAPP = async function ($, moduleCodesString) {
  await FeedItemEach($, async (item, i) => {
    //console.log(i, item.find('title').text())
    //item.remove()
    
    //let link = FeedItemGetLink(item)
    //let {content} = await fullTextParser(link, moduleCodesString)
    //console.log(i, content)
    //FeedItemSetContent(item, content)
    
//    let title = item.find('title:first').text().trim()
//    if (title.endsWith('...')) {
//      title = title.slice(0, -3)
//    }
    
    let link = FeedItemGetLink(item)
    let content = await PuppeterHTMLLoader(link)
//    console.log('===========')
//    console.log(link)
//    console.log('===========')
//    console.log(content)
//    console.log('===========')
    let $content = cheerio.load(content)
    let $img = $content('#slide-img-0')
    let $iframe = $content('#iframe-container')
    $content = $content('#product-view-container .product-main-description article:first')
    content = $content.html().trim()
    if ($img.length > 0) {
      content = $img.prop('outerHTML') + '<br />' + content
    }
    if ($iframe.length > 0) {
      content = $iframe.prop('outerHTML') + '<br />' + content
    }
    
    FeedItemSetContent(item, content)
    
    //let content = FeedItemGetContent(item)
    
//    if (content.startsWith(title)) {
//      console.log(title)
//    }
    
  })
  
  return $
}

module.exports = xLinuxAPP