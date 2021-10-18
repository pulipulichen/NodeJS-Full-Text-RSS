const FeedChannelTitle = function ($) {
  let title = $('channel > title:first')
  if (title.length === 1) {
    return title.text().trim()
  }
  
  title = $('feed > title:first')
  if (title.length === 1) {
    return title.text().trim()
  }
  
  throw Error('Title is not found')
}

module.exports = FeedChannelTitle