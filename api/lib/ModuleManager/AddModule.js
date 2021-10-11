const AddModule = function (moduleCodesString, module) {
  if (!module) {
    return moduleCodesString
  }
  
  if (!Array.isArray(module)) {
    module = [module]
  }
  
  let codes = moduleCodesString.split(',')
  module.forEach(m => {
    if (codes.indexOf(m) === -1) {
      codes.push(m)
    }
  })
  
  return codes.join(',')
}

module.exports = AddModule