const fScaryplayTTV = function ({item, channel}) {
  let title = item.find('title').text().trim()
  
  return (!title.endsWith('希治閣Podcast'))
}

module.exports = fScaryplayTTV