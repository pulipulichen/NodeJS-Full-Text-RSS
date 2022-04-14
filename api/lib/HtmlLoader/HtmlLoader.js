const request = require("request")
const nodeCache = require('./../cache/node-cache-sqlite.js')
const sleep = require('./../async/sleep.js')

let isLoading = false

const dayjs = require('dayjs')

const asyncRequest = function (url) {
  
  return new Promise(async (resolve, reject) => {
    while (isLoading) {
      await sleep(100)
    }
    isLoading = true
    
    request({uri: url}, 
      function(error, response, body) {
        
        isLoading = false
        if (error) {
          console.error(error)
          return reject(error)
        }
        if (response.statusCode !== 200) {
          let message = 'StatusCode is not 200: ' + response.statusCode + ' ' + url
          console.error(`[${dayjs().format('MMDD-HHmm')}] ` + message)
          return reject(message)
        }

        //body = body.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
        //body = body.replace(/[\u0000-\u0009\u000B\u001F\u007F-\u009F]/g, "")
        //body = body.replace(/[\u001A-\u001A]/g, "")
        resolve(body)
    })
  })
}

let maxCacheYear = 1
let maxCacheTime = maxCacheYear * 365 * 24 * 60 * 60 * 1000

const htmlLoader = async function (url, cacheMS) {
  if (!cacheMS) {
    cacheMS = maxCacheTime
  }
  //cacheMS = 10
  
  return await nodeCache.get('html-loader', url, async () => {
    return await asyncRequest(url)
  }, cacheMS)
}

module.exports = htmlLoader
  