const FeedItemGetLink = function (item) {
  let linkElement = item.find('link:first')
  
  if (linkElement.length === 0) {
    throw Error('no link tag: ' + item.html())
  }
  
  let href = linkElement.attr('href')
  if (typeof(href) === 'string' && href.length > 6) {
    return href
  }
  else if (linkElement.text().trim() !== '') {
    return linkElement.text().trim()
  } 
}

module.exports = FeedItemGetLink