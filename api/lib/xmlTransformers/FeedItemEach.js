const cheerio = require('cheerio')
const sleep = require('./../async/sleep.js')

const FeedItemEach = async function ($, handler) {
  
  let items = $('channel > item')
  //console.log('items.length', items.length)
  
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
    //console.log(i)
  }
  await sleep(50)
  
//  if (items.length === 0) {
//    console.log($.html())
//    console.error('Item is not found.')
//  }
  
  return $
}

module.exports = FeedItemEach