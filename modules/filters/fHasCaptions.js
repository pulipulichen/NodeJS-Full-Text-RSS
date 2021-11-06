const fHasCaptions = function ({item, channel}) {
//  if (!item) {
//    return true
//  }
  
  let title = item.find('title').text().trim()
  
  return (!title.startsWith('C]'))
}

module.exports = fHasCaptions