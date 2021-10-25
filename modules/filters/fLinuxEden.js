const fLinuxEden = function ({item, channel}) {
  let title = item.find('title').text().trim()
  
  return (!title.startsWith('每日文章精选 ') && !title.startsWith('开源美图 '))
}

module.exports = fLinuxEden