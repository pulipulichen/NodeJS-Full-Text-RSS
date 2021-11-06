const fLowScoreBoy = function ({item, channel}) {
  let title = item.find('title').text().trim()
  
  if (title.startsWith('[低分少年LIVE]')) {
    return false
  }
  
  if (title.startsWith('[低分少年] ')) {
    title = title.slice(7).trim()
    item.find('title').text(title)
  }
  
  return true
}

module.exports = fLowScoreBoy