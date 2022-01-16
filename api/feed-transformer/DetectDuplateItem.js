const FeedChannelLink = require('./../lib/xmlTransformers/FeedChannelLink.js')
const FeedChannelTitle = require('./../lib/xmlTransformers/FeedChannelTitle.js')
const NodeCacheSQLite = require('./../lib/cache/node-cache-sqlite.js')

const cacheYear = 1
const cacheTime = cacheYear * 365 * 24 * 60 * 60 * 1000

const DetectDuplateItem = async function (channelTitle, channelLink, item) {
  //return false // for test
  
  //let channelTitle = FeedChannelTitle($)
  //let channelLink = FeedChannelLink($)
  
  //console.log(channelTitle)
  //console.log(channelLink)
  //console.log(channelLink.trim(), channelTitle.trim())
  
  let title = item.find('title:first').text().trim()
  
  let cachedChannelLinkTitle = await NodeCacheSQLite.get('duplate-item', title, () => {
    return channelLink + channelTitle
  }, cacheTime)
  
  //console.log(title, (cachedChannelLinkTitle !== channelLink + channelTitle), channelLink + channelTitle, cachedChannelLinkTitle)
  
  return (cachedChannelLinkTitle !== channelLink + channelTitle)
}

module.exports = DetectDuplateItem