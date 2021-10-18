const ModuleManager = require('./../lib/ModuleManager/ModuleManager.js')
const HasModuleType = require('./../lib/ModuleManager/HasModuleType.js')
const AddModule = require('./../lib/ModuleManager/AddModule.js')

const cheerio = require('cheerio')

const FeedItemEach = require('./../lib/xmlTransformers/FeedItemEach.js')
const DetectFeedModule = require('./DetectFeedModule.js')

const format = require('xml-formatter')

const FeedTransformer = async function (feedXML, moduleCodesString) {
  
  
  // -------------------------------
  // 先處理基本的
  
  const $ = cheerio.load(feedXML, {
    xmlMode: true,
    decodeEntities: false
  })
  
  moduleCodesString = DetectFeedModule($, moduleCodesString)
  //console.log(moduleCodesString)
  
  // -----------------------------
  
  //$('title').text('new')
  await FeedItemEach($, async (item, i) => {
    
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
    let titleNew = await ModuleManager(title, moduleCodesString, 't')
    //console.log(title, '||==||', titleNew)
    if (title !== titleNew) {
      item.find('title').text(titleNew)
    }
    
    let content = item.find('content').text()
    let contentNew = await ModuleManager(content, moduleCodesString, 'c')
    if (content !== contentNew) {
      item.find('content').text(contentNew)
    }
  })
  
  //console.log($('channel > item > title').text())
  
  // -----------------------------
  
  if (HasModuleType(moduleCodesString, 'x') === false) {
    moduleCodesString = AddModule(moduleCodesString, 'xDefault')
  }
  
  feedXML = await ModuleManager($, moduleCodesString, 'x')
  
  // -----------------------------
  
  feedXML = format($.html(), {
    collapseContent: true, 
  })
  
  // -------------------------------
  
  return feedXML
}

module.exports = FeedTransformer
