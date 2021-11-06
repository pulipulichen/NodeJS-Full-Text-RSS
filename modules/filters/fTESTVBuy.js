const fTESTVBuy = function ({item, channel}) {
  let title = item.find('title').text().trim()
  
  return (title.indexOf('值不值得买第') > -1)
}

module.exports = fTESTVBuy