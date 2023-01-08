const cheerio = require('cheerio')
const sleep = require('./../async/sleep.js')

const config = require('./../../../mount/config.js')

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
  
  let len = items.length
  if (len > config.FeedItemEach.limit) {
    len = config.FeedItemEach.limit
  }

  // $('title').html('items: ' + len)
  
  for (let i = 0; i < len; i++) {
    let item = items.eq(i)
    try {
      await handler(item, i)
    }
    catch (e) {
      // $('title').html(e.toString())
    }
    //console.log(i)
  }
  for (let i = len; i < items.length; i++) {
    let item = items.eq(i)
    item.remove()
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