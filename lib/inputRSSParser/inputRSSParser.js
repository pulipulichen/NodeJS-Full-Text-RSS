const Parser = require('rss-parser')
const parser = new Parser()

const nodeCacheSQLite = require('./../cache/node-cache-sqlite.js')
const sleep = require('./../async/sleep.js')

let parseIsLoading = false
let cacheExpireHour = require('./../../config.js').cacheLimitHour.inputRSSParser

/**
 * feedURL: https://blog.pulipuli.info/feeds/posts/default
 */
const inputRSSParser = async function (feedURL) {
  //console.log(cacheExpireHour)
  return await nodeCacheSQLite.get('input-rss-parser', feedURL, async () => {
    while (parseIsLoading) {
      await sleep(3000)
    }

    parseIsLoading = true
    let result = await parser.parseURL(feedURL)
    parseIsLoading = false
    
    return result
  }, cacheExpireHour * 1000 * 60 * 60)
}

module.exports = inputRSSParser