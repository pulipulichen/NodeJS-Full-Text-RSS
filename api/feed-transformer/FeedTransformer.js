const ModuleManager = require('./../lib/ModuleManager/ModuleManager.js')
const HasModuleType = require('./../lib/ModuleManager/HasModuleType.js')
const AddModule = require('./../lib/ModuleManager/AddModule.js')

const cheerio = require('cheerio')

const FeedItemEach = require('./../lib/xmlTransformers/FeedItemEach.js')
const DetectFeedModule = require('./DetectFeedModule.js')
const DetectDuplateItem = require('./DetectDuplateItem.js')

const FeedItemGetContent = require('./../lib/xmlTransformers/FeedItemGetContent.js')
const FeedItemSetContent = require('./../lib/xmlTransformers/FeedItemSetContent.js')
const FeedChannelAppendTitle = require('./../lib/xmlTransformers/FeedChannelAppendTitle.js')

const format = require('xml-formatter')

const MailToBlogger = require('./../full-text-parser/parsers/titleModifiers/MailToBlogger.js')

const RemoveControlCharacters = require('./../lib/stringUtils/RemoveControlCharacters.js')

const FeedChannelLink = require('./../lib/xmlTransformers/FeedChannelLink.js')
const FeedChannelTitle = require('./../lib/xmlTransformers/FeedChannelTitle.js')

const NodeCacheSQLite = require('./../lib/cache/node-cache-sqlite.js')

const cacheYear = 1
const cacheTime = cacheYear * 365 * 24 * 60 * 60 * 1000

const FeedTransformer = async function (feedXML, moduleCodesString) {
  
  // -------------------------------
  // 先處理基本的
  
  //console.log(feedXML)
  
  let $ = cheerio.load(feedXML, {
    xmlMode: true,
    decodeEntities: false
  })
  
  FeedChannelAppendTitle($, moduleCodesString)
  
  //console.log($.html())
  
  //console.log('================')
  //console.log($.html())
  
  moduleCodesString = DetectFeedModule($, moduleCodesString)
  //console.log(moduleCodesString)
  
  let channelTitle = FeedChannelTitle($)
  let channelLink = FeedChannelLink($)
  
  if (typeof(channelLink) !== 'string') {
    console.error('channelLink is not a link', moduleCodesString)
    console.log(feedXML)
    console.log('=============')
    return false
  }
  
  // -----------------------------
  
  //$('title').text('new')
  await FeedItemEach($, async (item, i) => {
    //console.log(i)
    //console.log('DetectDuplateItem', await DetectDuplateItem($, item))


    // 暫時先關閉，反正用到機會也不多 20230109-0413 
    // if (await DetectDuplateItem(channelTitle, channelLink, item, moduleCodesString)) {
    //   return item.remove()
    // }
    
    // ------------------------
    //console.log(i, item.find('title').text())
    
    let match = await ModuleManager({
      item,
      channel: $
    }, moduleCodesString, 'f')
    if (match === false) {
      item.remove()
      return false
    }
    
    // ------------------------
    
    let title = item.find('title').text()
    let content = FeedItemGetContent(item)
    
    let cacheKey = channelLink + title
    let itemRemoved = false
    if ((await NodeCacheSQLite.isExists('item-loaded', cacheKey)) === false) {
      item.remove()
      itemRemoved = true
    }

    let setupItem = async () => {
      //console.log('讀取嗎？', cacheKey)
      
      let titleNew = await ModuleManager(title, moduleCodesString, 't')
        
      titleNew = MailToBlogger(titleNew)
      
      //console.log(title, '||==||', titleNew)
      if (title !== titleNew && !itemRemoved) {
        item.find('title').text(titleNew)
      }
      
      //console.log(i, content.slice(0, 100))
      let contentNew = await ModuleManager(content, moduleCodesString, 'c', item)
      //console.log(i, contentNew.slice(0, 100))
      if (content !== contentNew && !itemRemoved) {
        //item.find('content').text(contentNew)
        FeedItemSetContent(item, contentNew)
      }

      await NodeCacheSQLite.get('item-loaded', cacheKey, async function () {
        return (new Date()).getTime()
      }, cacheTime)
      
      //console.log('讀取完成')
    }
    
    if (itemRemoved === true) {
      setTimeout(() => {
        setupItem()
      }, 0)
    }
    else {
      await setupItem()
    }

  })
  
  //console.log('結束？')
  
  //console.log($('channel > item > title').text())
  
  /*
  $('feed:first').append(`<image>
    <url>https://www.gravatar.com/avatar/b30ce50678f0e934eaa6697425c59dd7?s=64&d=identicon&r=PG</url>
    <title>example image</title>
    <link>https://www.gravatar.com/avatar/b30ce50678f0e934eaa6697425c59dd7?s=64&d=identicon&r=PG</link>
  </image>`)
   */
//  $('feed:first').prepend(`<icon>https://iconarchive.com/download/i46591/saki/nuoveXT/Apps-demo.ico</icon>`)
//  $('feed:first').prepend(`<atom:icon>https://iconarchive.com/download/i38830/google/chrome/Google-Chrome.ico</atom:icon>`)
//  $('feed:first').prepend(`<logo>https://www.gravatar.com/avatar/b30ce50678f0e934eaa6697425c59dd7?s=64&d=identicon&r=PG</logo>`)
//  
  // -----------------------------
  
  if (HasModuleType(moduleCodesString, 'x') === false) {
    moduleCodesString = AddModule(moduleCodesString, 'xDefault')
  }
  //console.log(moduleCodesString)
  //console.log($(':root').html())
  //console.log($.html())
  
  $ = await ModuleManager($, moduleCodesString, 'x')
  //console.log($.html().slice(0, 200))
  
  // -----------------------------
  
  //console.log($("feed").length)
  if ($("feed").length > 0) {
    $ = $("feed:first")
    feedXML = $.prop('outerHTML')
    //console.log('first feed')
  }
  else {
    //console.log('root feed')
    //feedXML = $(':root').html()
    feedXML = $.html()
  }
  //console.log($(":root > div").length)
  
  feedXML = RemoveControlCharacters(feedXML)
  
  //console.log(feedXML.slice(0, 300))
  //console.log(feedXML.slice(-300))
  try {
    feedXML = format(feedXML, {
      collapseContent: true, 
    })
  }
  catch (e) {
    console.error(e)
  }
  //feedXML = $.html()
  //console.log('feedXML', feedXML)
  // -------------------------------
  
  return feedXML
}

module.exports = FeedTransformer
