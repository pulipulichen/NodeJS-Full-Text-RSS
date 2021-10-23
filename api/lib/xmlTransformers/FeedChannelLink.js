const FeedChannelLink = function ($) {
  //console.log($.html())
  let link = $('channel > link:first')
  if (link.length === 1) {
    let href = link.text().trim()
    if (href === '') {
      href = link.attr('href').trim()
    }
    return href
  }
  
  link = $('feed > link:first')
  if (link.length === 1) {
    let href = link.attr('href')
    
    if (typeof(href) === 'string' && href.length > 6) {
      return href.trim()
    } 
  }
  
  //console.log($.html())
  throw Error('Link is not found')
}

module.exports = FeedChannelLink