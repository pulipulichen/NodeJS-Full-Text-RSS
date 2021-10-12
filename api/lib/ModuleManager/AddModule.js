const AddModule = function (moduleCodesString = [], module) {
  if (!module) {
    return moduleCodesString
  }
  
  if (!Array.isArray(module)) {
    module = [module]
  }
  
  let codes
  if (Array.isArray(moduleCodesString) === false) {
    codes = moduleCodesString.split(',')
  }
  else {
    codes = moduleCodesString
  }
  
  module.forEach(m => {
    if (codes.indexOf(m) === -1) {
      codes.push(m)
    }
  })
  
  return codes.join(',')
}

module.exports = AddModule