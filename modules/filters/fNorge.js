const fNorge = function ({item, channel}) {
  let title = item.find('title').text().trim()
  
  channel('channel > title').text('呱吉：新資料夾')
  
  return (title.startsWith('【呱吉Podcast】新資料夾('))
}

module.exports = fNorge