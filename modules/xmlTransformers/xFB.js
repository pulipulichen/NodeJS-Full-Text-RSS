//const cheerio = require('cheerio')

const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const xFBType = require('./xFB/xFBType.js')
const xFBPost = require('./xFB/xFBPost.js')

const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')

const FeedItemGetLink = require('./../../api/lib/xmlTransformers/FeedItemGetLink.js')
const FeedItemSetLink = require('./../../api/lib/xmlTransformers/FeedItemSetLink.js')

const DesafeImg = require('./xFB/xFBDesafeImg.js')

const replaceTitleWithDesription = require('./xFB/replaceTitleWithDesription.js')

const xFB = async function ($, moduleCodesString) {
  //console.log('xFB')
  
//  const $ = cheerio.load(feedXML, {
//    xmlMode: true,
//    decodeEntities: false
//  })
  
  // -----------------------------
  
  //$('title').text('new')
  await FeedItemEach($, async (item, i) => {
    let type = await xFBType(item, moduleCodesString)
    let fbLink = FeedItemGetLink(item)
    
    //console.log(i, type, fbLink, item.find('title').text())
    
    
    if (type !== 'video' && type !== 'post') {
      // 讀取全文
      //let {title, content} = await fullTextParser(type, moduleCodesString)
      //let fbLink = item.find('link').text().trim()
      
      
      item.find('link').text(type)
      FeedItemSetLink(item, type)
      
      let description = item.find('description').text().trim()
      
      let {title, content} = await fullTextParser(type, moduleCodesString)
      
      
      
      if (title !== '') {
        item.find('title').text(title)
      }
      
      if (content !== '') {
        if (description !== '') {
          description = DesafeImg(description)
          content = '<![CDATA[' + `<a href="${fbLink}" target="_blank">Facebook Post</a><br>${description}` + '<hr />' + content + ']]>'
        }
        item.find('description').text(content)
      }
      else {
        //item.find('description').html(description)
        await xFBPost(item, i)
      }
      
      //console.log(i, content.slice(0, 200))
      //console.log(description)
    }
    else if (type === 'video') {
      /*
      let title = item.find('title').text().trim()
      title = '[V]' + title
      item.find('title').text(title)
       */
      replaceTitleWithDesription(item)
    }
    else if (type === 'post') {
      await xFBPost(item, i)
      
      //console.log(i, title)
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