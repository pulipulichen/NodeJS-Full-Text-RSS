const cheerio = require('cheerio')

const FeedItemEach = async function ($, handler) {
  
  let items = $('channel > item')
  if (items.length === 0) {
    items = $('feed > entry')
    //console.log(items.length)
  }
  if (items.length === 0) {
    items = $('item')
    //console.log(items.length)
  }
  if (items.length === 0) {
    items = $('entry')
    //console.log(items.length)
  }
  
  for (let i = 0; i < items.length; i++) {
    let item = items.eq(i)
    await handler(item, i)
  }
  
//  if (items.length === 0) {
//    console.log($.html())
//    console.error('Item is not found.')
//  }
  
  return $
}

module.exports = FeedItemEach