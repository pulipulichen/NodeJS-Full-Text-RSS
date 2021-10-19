/*
const Parser = require('rss-parser')
const parser = new Parser()

const nodeCacheSQLite = require('./../cache/node-cache-sqlite.js')
const sleep = require('./../async/sleep.js')

let parseIsLoading = false
let cacheExpireHour = require('./../../config.js').cacheLimitHour.inputRSSParser
*/
const nodeCacheSQLite = require('./../lib/cache/node-cache-sqlite.js')
const cacheExpireHour = require('./../../config.js').FeedCrawler.cacheLimitHour
const cacheExpireTime = cacheExpireHour * 60 * 60 * 1000

const HtmlLoader = require('./../lib/HtmlLoader/HtmlLoader.js')
const FeedTransformer = require('./../feed-transformer/FeedTransformer.js')

const FeedURLFilter = require('./FeedURLFilter.js')
const RepairXML = require('./RepairXML.js')

/**
 * feedURL: https://blog.pulipuli.info/feeds/posts/default
 */
const FeedCrawler = async function (feedURL, moduleCodesString) {

  feedURL = FeedURLFilter(feedURL)
  
  //console.log(feedURL)

  let feedXML = await HtmlLoader(feedURL, cacheExpireTime)
  //console.log(feedXML)
  
  let output = await FeedTransformer(feedXML, moduleCodesString)
  
  output = await RepairXML(output)
  //console.log(output)

  return output
}

module.exports = FeedCrawler