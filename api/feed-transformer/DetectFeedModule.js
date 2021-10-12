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
  if (channelLink.startsWith('https://www.ptt.cc/')) {
    addModules.push('xPTT')
  }
  
  moduleCodesString = AddModule(moduleCodesString, addModules)
  
  return moduleCodesString
}

module.exports = DetectFeedModule