const AddModule = require('./../lib/ModuleManager/AddModule.js')
const FeedChannelLink = require('./../lib/xmlTransformers/FeedChannelLink.js')
const FeedFeedGeneratorURI = require('./../lib/xmlTransformers/FeedFeedGeneratorURI.js')

const DetectFeedModule = function ($, moduleCodesString) {
  let channelLink = FeedChannelLink($)
  let feedGeneratorURI = FeedFeedGeneratorURI($)
  //console.log(channelLink)
  // $('channel > link:first').text().trim()
  //console.log(channelLink)
  
  let addModules = []
  
  if (channelLink.startsWith('https://www.facebook.com/')) {
    addModules.push('xFB')
  }
  else if (channelLink.startsWith('https://twitter.com/')) {
    addModules.push('xTwitter')
  }
  else if (channelLink.startsWith('https://github.com/')) {
    addModules.push('xGitHub')
  }
  else if (channelLink.startsWith('https://www.emerald.com/insight/publication/')) {
    addModules.push('xEmerald')
  }
  else if (channelLink.startsWith('https://sub-tongli-2020.blogspot.com/')) {
    addModules.push('tMailToBlogger')
    addModules.push('tTongliNewletter')
    addModules.push('cTongliNewletter')
  }
  else if (channelLink.startsWith('https://sub-steam-wishlist-2017.blogspot.com/')) {
    addModules.push('cSteamOnSale')
  }
  else if (channelLink.startsWith('https://soundcloud.com/')) {
    addModules.push('xPodcast')
  }
  else if (channelLink.startsWith('https://www.reddit.com/r/')) {
    addModules.push('xReddit')
  }
  else if (feedGeneratorURI === 'https://www.plurk.com/user/') {
    addModules.push('xSkip')
  }
  else if (channelLink.startsWith('https://www.y' + 'out' + 'ube.com/')
          || channelLink.startsWith('http://www.y' + 'out' + 'ube.com/')) {
    addModules.push('xUB')
  }
  
  
  if (channelLink.endsWith('videos.xml?channel_id=UCLgGLSFMZQB8c0WGcwE49Gw')) {
    addModules.push('tGamker')
  }
  if (channelLink === 'http://www.youtube.com/feeds/videos.xml?channel_id=UCK-qc_POQZwWrMg-Pr-oYtg') {
    addModules.push('tSH')
  }
  if (channelLink === 'https://www.oschina.net/news/rss') {
    addModules.push('tOSChina')
  }
  if (channelLink === 'https://www.techbang.com/') {
    addModules.push('cTechbang')
  }
  if (channelLink === 'https://www.soft4fun.net') {
    addModules.push('cSoft4fun')
  }
  if (channelLink.startsWith('https://www.linux-apps.com/')) {
    addModules.push('xLinuxAPP')
  }
  if (channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UCk25FUc8pLiP3A6Zniknxbg')) {
    addModules.push('fScaryplayTTV')
  }
//  if (channelLink.startsWith('https://www.ptt.cc/')) {
//    addModules.push('xPTT')
//  }

  if (channelLink.startsWith('https://pcrookie.com')) {
    addModules.push('cRemoveNoscript')
  }
  
  //console.log(channelLink, addModules)
  
  moduleCodesString = AddModule(moduleCodesString, addModules)
  
  return moduleCodesString
}

module.exports = DetectFeedModule