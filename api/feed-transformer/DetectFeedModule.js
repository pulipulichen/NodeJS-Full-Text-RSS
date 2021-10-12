const AddModule = require('./../lib/ModuleManager/AddModule.js')

const DetectFeedModule = function ($, moduleCodesString) {
  let channelLink = $('channel > link:first').text().trim()
  //console.log(channelLink)
  
  let addModules = []
  if (channelLink.startsWith('https://www.facebook.com/')) {
    addModules.push('xFB')
  }
  if (channelLink.startsWith('https://www.ptt.cc/bbs/')) {
    addModules.push('xPTT')
  }
  
  moduleCodesString = AddModule(moduleCodesString, addModules)
  
  return moduleCodesString
}

module.exports = DetectFeedModule