const AddModule = require('./../lib/ModuleManager/AddModule.js')
const FeedChannelLink = require('./../lib/xmlTransformers/FeedChannelLink.js')

const DetectFeedModule = function ($, moduleCodesString) {
  let channelLink = FeedChannelLink($)
  //console.log(channelLink)
  // $('channel > link:first').text().trim()
  //console.log(channelLink)
  
  let addModules = []
  
  if (channelLink.startsWith('https://www.facebook.com/')) {
    addModules.push('xFB')
  }
  else if (channelLink.startsWith('https://github.com/')) {
    addModules.push('xGitHub')
  }
//  if (channelLink.startsWith('https://www.ptt.cc/')) {
//    addModules.push('xPTT')
//  }
  
  //console.log(addModules)
  
  moduleCodesString = AddModule(moduleCodesString, addModules)
  
  return moduleCodesString
}

module.exports = DetectFeedModule