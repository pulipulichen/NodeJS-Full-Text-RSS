const fLinuxEden = function ({item, channel}) {
  let title = item.find('title').text().trim()
  
  return (!title.startsWith('每日文章精选 '))
}

module.exports = fLinuxEden