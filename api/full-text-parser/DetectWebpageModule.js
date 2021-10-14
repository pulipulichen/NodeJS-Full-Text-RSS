const AddModule = require('./../lib/ModuleManager/AddModule.js')

const DetectWebpageModule = function (url, moduleCodesString) {
  let addModules = []
  if (url.startsWith('https://www.ptt.cc/bbs/')) {
    addModules.push('tPTT')
    addModules.push('cPTT')
  }
  else if (url.startsWith('http://www.linuxeden.com/')) {
    addModules.push('cLinuxEden')
  }
    
  if (url.startsWith('https://www.facebook.com/')) {
    addModules.push('hFB')
  }
  else {
    addModules.push('hDefault')
  }
  
  moduleCodesString = AddModule(moduleCodesString, addModules)
  
  return moduleCodesString
}

module.exports = DetectWebpageModule