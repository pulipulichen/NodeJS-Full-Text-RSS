const fUBSky = function ({item, channel}) {
  let title = item.find('title').text().trim()
  
  return (title.startsWith('《蓋星聞》'))
}

module.exports = fUBSky