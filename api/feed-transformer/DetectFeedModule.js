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
  else if (channelLink.startsWith('https://soundcloud.com/')) {
    addModules.push('xPodcast')
  }
  else if (channelLink.startsWith('https://www.reddit.com/r/')) {
    addModules.push('xReddit')
  }
//  else if (feedGeneratorURI === 'https://www.joomla.org') {
//    addModules.push('xSkip')
//  }
  else if (channelLink.startsWith('https://www.y' + 'out' + 'ube.com/')
          || channelLink.startsWith('http://www.y' + 'out' + 'ube.com/')) {
    addModules.push('xUB')
  }
//  if (channelLink.startsWith('https://www.ptt.cc/')) {
//    addModules.push('xPTT')
//  }
  
  //console.log(channelLink, addModules)
  
  moduleCodesString = AddModule(moduleCodesString, addModules)
  
  return moduleCodesString
}

module.exports = DetectFeedModule