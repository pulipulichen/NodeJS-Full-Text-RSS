const HasModuleType = function (moduleCodesString, prefix) {
  if (!moduleCodesString || !prefix) {
    return false
  }
  
  let moduleCodes = moduleCodesString.split(',')
  
  return (moduleCodes.filter(m => m.startsWith(prefix)).length > 0)
}

module.exports = HasModuleType