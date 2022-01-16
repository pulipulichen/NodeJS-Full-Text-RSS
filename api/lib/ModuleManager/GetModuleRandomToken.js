const GetModuleRandomToken = function (moduleCodesString = []) {
  
  let codes
  if (Array.isArray(moduleCodesString) === false) {
    codes = moduleCodesString.split(',')
  }
  else {
    codes = moduleCodesString
  }

  for (let i = 0; i < codes.length; i++) {
    let code = codes[i]
    if (code.startsWith('$') && code.endsWith('$')) {
      return code
    }
  }

  return ''
}

module.exports = GetModuleRandomToken