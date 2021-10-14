const FeedChannelLink = function ($) {
  let link = $('channel > link:first')
  if (link.length === 1) {
    return link.text().trim()
  }
  
  link = $('feed > link:first')
  if (link.length === 1) {
    let href = link.attr('href')
    
    if (typeof(href) === 'string' && href.length > 6) {
      return href
    } 
  }
  
  throw Error('Link is not found')
}

module.exports = FeedChannelLink