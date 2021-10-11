module.exports = function (str, needle) {
  if (!needle || typeof(str) !== 'string') {
    return str
  }
  
  let typeofNeedle = typeof(needle)
  if (typeof(needle) === 'number') {
    needle = typeofNeedle + ''
  }
  
  if (typeof(needle) !== 'string'
          && typeof(needle[0]) !== 'string') {
    return str
  }
  
  if (Array.isArray(needle)) {
    if (typeof(needle[0]) !== 'string'
            || needle.length === 0) {
      return str
    }
  }
  
  // -------------
  
  if (Array.isArray(needle) === false) {
    str = [str]
  }
  
  for (let i = 0; i < needle.length; i++) {
    let n = needle[i]
    let pos = str.lastIndexOf(n)
    if (pos > -1) {
      return str.slice(0, pos).trim()
    }
  }
  
  return str
}