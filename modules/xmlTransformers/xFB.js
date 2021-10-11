const cheerio = require('cheerio')

const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const xFBType = require('./xFB/xFBType.js')
const xFBTitle = require('./xFB/xFBTitle.js')

const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')

const xFB = async function ($, moduleCodesString) {
  //console.log('xFB')
  
//  const $ = cheerio.load(feedXML, {
//    xmlMode: true,
//    decodeEntities: false
//  })
  
  // -----------------------------
  
  //$('title').text('new')
  await FeedItemEach($, async (item, i) => {
    let type = await xFBType(item, i)
    //console.log(i, item.find('title').text(), type)
    
    
    if (type !== 'video' && type !== 'post') {
      // 讀取全文
      //let {title, content} = await fullTextParser(type, moduleCodesString)
      
      let description = item.find('description').text().trim()
      
      let {title, content} = await fullTextParser(type, moduleCodesString)
      
      item.find('title').text(title)
      if (description !== '') {
        content = description + '<hr />' + content
      }
      item.find('description').text(content)
      
      //console.log(i, content.slice(0, 200))
      //console.log(description)
    }
    else if (type === 'video') {
      let title = item.find('title').text().trim()
      title = '[V] ' + title
      item.find('title').text(title)
    }
    else if (type === 'post') {
      await xFBTitle(item, i)
      
      let title = item.find('title').text().trim()
      title = '[P] ' + title
      item.find('title').text(title)
    }
    
    // 要怎麼決定要不要取代Item?
    
//    let title = item.find('title').text()
//    let titleNew = await ModuleManager(title, moduleCodesString, 't')
//    if (title !== titleNew) {
//      item.find('title').text(titleNew)
//    }
  })
  
  //console.log($('channel > item > title').text())
  
  // ---------------------------
  
  
  // -----------------------------
  
//  feedXML = $.html()
  
  return $
}

module.exports = xFB