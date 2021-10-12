const FeedItemSetLink = function (item, newLink) {
  let linkElement = item.find('link:first')
  
  if (linkElement.hasAttr('href')) {
    linkElement.attr('href', newLink)
  }
  else if (linkElement.text().trim() !== '') {
    linkElement.text(newLink)
  } 
}

module.exports = FeedItemSetLink