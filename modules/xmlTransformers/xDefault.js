const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const FeedItemGetLink = require('./../../api/lib/xmlTransformers/FeedItemGetLink.js')
const FeedItemSetContent = require('./../../api/lib/xmlTransformers/FeedItemSetContent.js')
const FeedItemGetContent = require('./../../api/lib/xmlTransformers/FeedItemGetContent.js')

const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')

const xDefaultRemoveTitle = require('./xDefault/xDefaultRemoveTitle.js')

const needToLoadFullText = 5000

const FeedChannelLink = require('./../../api/lib/xmlTransformers/FeedChannelLink.js')
const NodeCacheSQLite = require('./../../api/lib/cache/node-cache-sqlite.js')
const sleep = require('./../../api/lib/async/sleep.js')

const cacheYear = 1
const cacheTime = cacheYear * 365 * 24 * 60 * 60 * 1000

const xDefault = async function ($, moduleCodesString) {
  //console.log('xDefault')
  //console.log($.html())
  
  let channelLink = FeedChannelLink($)
  if (typeof(channelLink) !== 'string') {
    console.error('channelLink is not a string', moduleCodesString)
    return false
  }
  
  await FeedItemEach($, async (item, i) => {
    if (FeedItemGetContent(item).length > needToLoadFullText) {
      return true
    }
    let title = item.find('title:first').text().trim()
    let cacheKey = channelLink + title
    let itemRemoved = false
    if ((await NodeCacheSQLite.isExists('item-loaded-xDefault', cacheKey)) === false) {
      item.remove()
      itemRemoved = true
    }
    
    let setupItem = async () => {
      let link = FeedItemGetLink(item)

      let {content} = await fullTextParser(link, moduleCodesString)
      //console.log('xDefault', i, link, content.length, content.slice(-200))
      //console.log(content)


      content = xDefaultRemoveTitle(content, title)
      //console.log(i, '<<<', content, '>>>')

      //if (i === 4) {
        //content = content.slice(content.indexOf('<p'), content.indexOf('</p>') + 3)
        //content = content.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
        if (itemRemoved === false) {
          FeedItemSetContent(item, content)
        }
        //console.log(i, '<<<', content, '>>>')
      //}

      await NodeCacheSQLite.get('item-loaded-xDefault', cacheKey, async function () {
        return (new Date()).getTime()
      }, cacheTime)
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
  await sleep(50)
  
  //console.log('ok')
  
  return $
}

module.exports = xDefault
