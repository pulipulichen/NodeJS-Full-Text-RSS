const request = require("request")
const nodeCache = require('./../../lib/cache/node-cache-sqlite.js')

const asyncRequest = function (url) {
  return new Promise(async (resolve, reject) => {
    request({uri: url}, 
      function(error, response, body) {
        if (error) {
          console.error(error)
          return reject(false)
        }

        resolve(body)
    })
  })
}

const htmlLoader = async function (url) {
  return await nodeCache.get('html-loader', url, async () => {
    return await asyncRequest(url)
  })
}

module.exports = htmlLoader
  