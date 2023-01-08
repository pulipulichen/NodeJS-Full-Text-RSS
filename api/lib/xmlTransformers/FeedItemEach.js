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
  
  let titleElements = $('title')
  for (let i = 0; i < titleElements.length; i++) {
    // // titleElements.eq(i).html(titleElements.eq(i).text())
    if (i < 1) {
      titleElements.eq(i).text('測試' + i)
    }
    else {
      titleElements.eq(i).text(titleElements.eq(i).text())
    }

    
  }
  // $('title').html('測試1')

  let len = items.length
  if (len > config.FeedItemEach.limit) {
    len = config.FeedItemEach.limit
  }
  
  for (let i = 0; i < len; i++) {
    let item = items.eq(i)
    await handler(item, i)
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