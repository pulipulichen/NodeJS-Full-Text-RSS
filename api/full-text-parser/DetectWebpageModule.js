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
  else if (url.startsWith('https://www.oschina.net/news/')) {
    addModules.push('cOSChinaNews')
  }
  else if (url.startsWith('https://www.paddlepaddle.org.cn/documentation/docs/')) {
    addModules.push('cPaddlePaddleDocumentation')
  }
  
  
  
   
  if (url.startsWith('https://www.facebook.com/')) {
    addModules.push('hFB')
  }
  else if (url.startsWith('https://ani.gamer.com.tw/animeVideo.php?sn=')
          || url.startsWith('https://www.youtube.com/watch?v=')
          || url.startsWith('https://youtu.be/')) {
    addModules.push('hSkip')
  }
  else if (url.startsWith('https://github.com/')) {
    addModules.push('hGitHub')
  }
  else {
    addModules.push('hDefault')
  }
  
  moduleCodesString = AddModule(moduleCodesString, addModules)
  
  return moduleCodesString
}

module.exports = DetectWebpageModule