const GetFirstLine = function (title) {
  let nPos = title.indexOf('\n')
  if (nPos > -1) {
    title = title.slice(0, nPos).trim()
  }
  
  nPos = title.indexOf('<br>')
  if (nPos > -1) {
    title = title.slice(0, nPos).trim()
  }
  
  return title
}

module.exports = GetFirstLine