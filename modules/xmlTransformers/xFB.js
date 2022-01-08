//const cheerio = require('cheerio')

const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const NodeCacheSQLite = require('./../../api/lib/cache/node-cache-sqlite.js')

const xFBType = require('./xFB/xFBType.js')
const xFBPost = require('./xFB/xFBPost.js')

const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')

const FeedItemGetLink = require('./../../api/lib/xmlTransformers/FeedItemGetLink.js')
const FeedItemSetLink = require('./../../api/lib/xmlTransformers/FeedItemSetLink.js')

const DesafeImg = require('./xFB/xFBDesafeImg.js')

const replaceTitleWithDesription = require('./xFB/replaceTitleWithDesription.js')
const xFBVideoPost = require('./xFB/xFBVideoPost.js')

const sleep = require('./../../api/lib/async//sleep.js')

const cacheYear = 1
const cacheTime = cacheYear * 365 * 24 * 60 * 60 * 1000

const xFB = async function ($, moduleCodesString) {
  //console.log('xFB')
  
//  const $ = cheerio.load(feedXML, {
//    xmlMode: true,
//    decodeEntities: false
//  })
  
  // -----------------------------
  
  //let hasItemRemoved = false
  
  //$('title').text('new')
  await FeedItemEach($, async (item, i) => {
    let fbLink = FeedItemGetLink(item)
    
    let cacheKey = fbLink
    
    let type = await xFBType(item, moduleCodesString)
    
    let description = item.find('description').text().trim()
    let itemRemoved = false
    
    if (type === false) {
      // 表示還在讀取中 20211203-1202 
      let cacheItem = item.clone()
      item.remove()
      item = cacheItem
      itemRemoved = true
      //hasItemRemoved = true
      //console.log('itemRemoved type')
      //return false
    }
    
    if ((await NodeCacheSQLite.isExists('item-loaded', cacheKey)) === false) {
      let cacheItem = item.clone()
      item.remove()
      item = cacheItem
      itemRemoved = true
      //hasItemRemoved = true
      //console.log('itemRemoved not loaded')
    }
    
    //console.log(i, type, fbLink, item.find('title').text())
    
    let setupItem = async () => {

      if (type !== 'video' && type !== 'post') {
        // 讀取全文
        //let {title, content} = await fullTextParser(type, moduleCodesString)
        //let fbLink = item.find('link').text().trim()


        item.find('link').text(type)
        FeedItemSetLink(item, type)

        let {title, content} = await fullTextParser(type, moduleCodesString)

        if (title !== '' && itemRemoved === false) {
          item.find('title').text(title)
        }

        if (content !== '') {
          if (description !== '') {
            description = DesafeImg(description)
            content = '<![CDATA[' 
                    + description
                    + `<br>`
                    + `<a href="${fbLink}" target="_blank">Facebook Post</a>`
                    + '<hr />' + content 
                    + ']]>'
          }
          
          if (!itemRemoved) {
            item.find('description').text(content)
          }
        }
        else {
          //item.find('description').html(description)
          await xFBPost(item, i)
        }

        //console.log(i, content.slice(0, 200))
        //console.log(description)
      }
      else if (type === 'video') {
        xFBVideoPost(item)
        //replaceTitleWithDesription(item)
      }
      else if (type === 'post') {
        await xFBPost(item, i)

        //console.log(i, item.find('title').text())
      }

      await NodeCacheSQLite.get('item-loaded', cacheKey, async function () {
        return (new Date()).getTime()
      }, cacheTime)

      // 要怎麼決定要不要取代Item?

  //    let title = item.find('title').text()
  //    let titleNew = await ModuleManager(title, moduleCodesString, 't')
  //    if (title !== titleNew) {
  //      item.find('title').text(titleNew)
  //    }
    }

    if (itemRemoved === true) {
      setTimeout(() => {
        setupItem()
      }, 0) // setTimeout(async () => {
    }
    else {
      await setupItem()
    }
  })
  
  //await sleep(50)
  //console.log($('channel > item > title').text())
  
  // ---------------------------
  
  
  // -----------------------------
  
//  feedXML = $.html()
  
  return $
}

module.exports = xFB