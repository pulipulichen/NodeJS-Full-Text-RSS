/* global __dirname */

const moduleRelativePath = './../../../modules/'
const fs = require('fs')
const path = require('path')

const ModuleManager = async function (data, moduleCodesString, prefix) {
  
  let moduleCodes = moduleCodesString.split(',')
  
  for (let i = 0; i < moduleCodes.length; i++) {
    let code = moduleCodes[i].trim()
    if (prefix && !code.startsWith(prefix)) {
      continue
    }
    
    let folder
    
    if (code.startsWith('t')) {
      folder = 'titleModifiers/'
    }
    else if (code.startsWith('c')) {
      folder = 'contentModifiers/'
    }
    else if (code.startsWith('f')) {
      folder = 'filters/'
    }
    else if (code.startsWith('x')) {
      folder = 'xmlTransformers/'
    }
    else if (code.startsWith('h')) {
      folder = 'HTMLLoaders/'
    }
    
    if (!folder) {
      console.log('Folder not found')
      continue
    }
    
    let requirePath = moduleRelativePath + folder + code + '.js'
    //console.log(path.resolve(__dirname, requirePath))
    
    if (fs.existsSync(path.resolve(__dirname, requirePath)) === false) {
      continue
    }
    
    let module = require(requirePath)
    if (!code.startsWith('f')) {
      try {
        //console.log(moduleCodesString)
        //console.log(`#====================#` + code)
        data = await module(data, code)
        //console.log(data.slice(0, 100))
      }
      catch (e) {
        console.error(requirePath + ' ' + e)
      }  
    }
    else {
      let matched = await module(data, code)
      if (matched === false) {
        return false
      }
    }
      
  }
  
  return data
}

module.exports = ModuleManager