const fUBJer = function ({item, channel}) {
  let title = item.find('title').text().trim()
  
  return (title.indexOf('直播') === -1
    && title.indexOf('劇場') === -1)
}

module.exports = fUBJer