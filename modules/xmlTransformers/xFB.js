const cheerio = require('cheerio')

const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const xFB = async function (feedXML, moduleCodesString) {
  //console.log('xFB')
  
//  const $ = cheerio.load(feedXML, {
//    xmlMode: true,
//    decodeEntities: false
//  })
  
  // -----------------------------
  
  //$('title').text('new')
  await FeedItemEach($, async (item, i) => {
    await xFBTitle(item, i)
    
//    let title = item.find('title').text()
//    let titleNew = await ModuleManager(title, moduleCodesString, 't')
//    if (title !== titleNew) {
//      item.find('title').text(titleNew)
//    }
  })
  
  //console.log($('channel > item > title').text())
  
  // -----------------------------
  
//  feedXML = $.html()
  
  return feedXML
}

const xFBTitle = async function (item, i) {
  let title = item.find('title').text()
  
  let nPos = title.indexOf('\n')
  if (title.indexOf('\n') > -1) {
    title = title.slice(0, nPos).trim()
  }
  
  item.find('title').text(title)
  //console.log(i, title)
}

module.exports = xFB