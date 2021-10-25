const FeedItemGetLink = function (item) {
  let linkElement = item.find('link[type="text/html"]:first')
  if (linkElement.length === 0) {
    linkElement = item.find('link:first')
  }
  
  if (linkElement.length === 0) {
    throw Error('no link tag: ' + item.html())
  }
  
  let href = linkElement.attr('href')
  if (typeof(href) === 'string' && href.length > 6) {
    return href
  }
  else if (linkElement.text().trim() !== '') {
    let link = linkElement.text().trim()
    
    if (link.startsWith('<!CDATA[')
            && link.endsWith(']]>')) {
      link = link.slice(8, -3)
    }
    try {
      new URL(link)
      return link
    }
    catch (e) {
      console.error('Link is invalid: ' + link)
      return false
    }
  } 
}

module.exports = FeedItemGetLink