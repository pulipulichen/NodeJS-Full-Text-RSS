const cheerio = require('cheerio')

const FeedItemEach = async function ($, handler) {
  
  let items = $('channel > item')
  if (items.length === 0) {
    items = $('feed > entry')
  }
  
  for (let i = 0; i < items.length; i++) {
    let item = items.eq(i)
    await handler(item, i)
  }
  
  return $
}

module.exports = FeedItemEach