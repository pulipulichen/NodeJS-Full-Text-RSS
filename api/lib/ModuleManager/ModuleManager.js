/* global __dirname */

const moduleRelativePath = './../../../modules/'
const fs = require('fs')
const path = require('path')

const ModuleManager = async function (data, moduleCodes, prefix) {
  
  moduleCodes = moduleCodes.split(',')
  
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
    
    if (!folder) {
      console.log('Folder not found')
      continue
    }
    
    let requirePath = moduleRelativePath + folder + code + '.js'
    console.log(path.resolve(__dirname, requirePath))
    
    if (fs.existsSync(path.resolve(__dirname, requirePath)) === false) {
      continue
    }
    
    let module = require(requirePath)
    data = module(data)
    
    if (data === false) {
      return false
    }
  }
  
  return data
}

module.exports = ModuleManager