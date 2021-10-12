const FeedItemSetLink = function (item, newLink) {
  let linkElement = item.find('link:first')
  
  let href = linkElement.attr('href')
  if (typeof(href) === 'string' && href.length > 6) {
    linkElement.attr('href', newLink)
  }
  else if (linkElement.text().trim() !== '') {
    linkElement.text(newLink)
  } 
}

module.exports = FeedItemSetLink