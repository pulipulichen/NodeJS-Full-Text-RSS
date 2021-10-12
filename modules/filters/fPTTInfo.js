const fPTTInfo = function (item) {
  let title = item.find('title').text().trim()
  
  return (title.startsWith('[情報]')
    || title.startsWith('[心得]'))
}

module.exports = fPTTInfo