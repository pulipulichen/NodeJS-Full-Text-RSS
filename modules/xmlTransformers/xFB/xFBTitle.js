
const xFBTitle = async function (item, i) {
  let title = item.find('title').text()
  
  let nPos = title.indexOf('\n')
  if (title.indexOf('\n') > -1) {
    title = title.slice(0, nPos).trim()
  }
  
  item.find('title').text(title)
  //console.log(i, title)
}

module.exports = xFBTitle