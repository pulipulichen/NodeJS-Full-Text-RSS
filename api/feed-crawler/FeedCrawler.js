// let disableCache = false
// disableCache = true

/*
const Parser = require('rss-parser')
const parser = new Parser()

const nodeCacheSQLite = require('./../cache/node-cache-sqlite.js')
const sleep = require('./../async/sleep.js')

let parseIsLoading = false
let cacheExpireHour = require('./../../config.js').cacheLimitHour.inputRSSParser
*/
const nodeCacheSQLite = require('./../lib/cache/node-cache-sqlite.js')
const cacheExpireHour = require('./../../mount/config.js').FeedCrawler.cacheLimitHour
let cacheExpireTime = cacheExpireHour * 60 * 60 * 1000

const XMLLoader = require('./../lib/HtmlLoader/XMLLoader.js')
const FeedTransformer = require('./../feed-transformer/FeedTransformer.js')

const FeedURLFilter = require('./FeedURLFilter.js')
const RepairXML = require('./RepairXML.js')

function cleanString(input) {
  var output = "";
  for (var i=0; i<input.length; i++) {
      if (input.charCodeAt(i) <= 127) {
          output += input.charAt(i);
      }
  }
  return output;
}

/**
 * feedURL: https://blog.pulipuli.info/feeds/posts/default
 */
const FeedCrawler = async function (feedURL, moduleCodesString) {

  if (feedURL.startsWith('http://rss.sciencedirect.com/')) {
    throw Error('RSS link is unavailable: ' + feedURL)
  }

  feedURL = FeedURLFilter(feedURL)
  
  //console.log(feedURL)
  // let feedXML = await XMLLoader(feedURL, 10000)
  // cacheExpireTime = 1000
  // if (disableCache) {
  //   cacheExpireTime = 1000
  // }

  // let feedXML = await XMLLoader(feedURL, cacheExpireTime)

  // 這是為了提供測試而做的，所以快取時間固定都很短
  let feedXML = await XMLLoader(feedURL, 10000)
  
  //console.log(feedXML)
  //feedXML = feedXML.replace(/[\x00-\x1F\x7F]/g , '')
  //var re = /(?![\x00-\x7F]|[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3})./g;
  //feedXML = feedXML.replace(re, "")
  //var bytelike= unescape(encodeURIComponent(feedXML));
  //feedXML= decodeURIComponent(escape(bytelike));
  //feedXML = cleanString(feedXML)
  

  let output = await FeedTransformer(feedXML, moduleCodesString)
  
  output = await RepairXML(output)

  //console.log(output)

  return output
}

module.exports = FeedCrawler