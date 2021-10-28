/* global __dirname */

const FeedCrawler = require('./FeedCrawler.js')
const NodeCacheSQLite = require('./../lib/cache/node-cache-sqlite.js')

const cacheExpireHour = require('./../../mount/config.js').FeedCrawler.cacheLimitHour
const cacheExpireTime = cacheExpireHour * 60 * 60 * 1000

const fs = require('fs')
const path = require('path')

const route = function (app) {
  let isXML = function (url) {
    //console.log(url)
    return (url.endsWith('.xml'))
  }
  
  let urlFilter = function (url) {

    if (url.startsWith('//')) {
      url = 'https:' + url
    }
    else if (!url.startsWith('https://')
            && !url.startsWith('http://')) {
      url = 'https://' + url
    }

    return url
  }
  
  let setHeader = function (res) {
    //res.type('application/atom+xml')
    res.set('Content-Type', 'application/atom+xml');
    res.set('Age', '0');
    res.set('Cache-Control', 'public, must-revalidate, proxy-revalidate, max-age=1');
    //res.set('Content-Encoding', 'gzip');
    res.set('Content-Length', '24918');
    res.set('Content-Type', 'application/atom+xml; charset=UTF-8');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Date', 'Tue, 19 Oct 2021 12:45:04 GMT');
    res.set('ETag', 'W/"24f22978dac24abab47721de102958df1c2955495a330cc4035327afc7d38ee6"');
    res.set('Expires', 'Tue, 19 Oct 2021 12:45:05 GMT');
    res.set('Last-Modified', 'Thu, 30 Sep 2021 12:41:52 GMT');
    res.set('Server', 'blogger-renderd');
    res.set('Vary', 'Accept-Encoding');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-XSS-Protection', '0');
  }
  
  app.get('/f/:url', async (req, res) => {
    try {
      let url = req.params.url
      url = urlFilter(url)
      let result = await FeedCrawler(url)

      //if (isXML(url)) {
      setHeader(res)
      //}

      //console.log('a')
      res.send(result)
    }
    catch (e) {
      res.send(e)
    }
  })
  
  app.get('/f/:modules/:url', async (req, res) => {
    try {
      let url = req.params.url
      url = urlFilter(url)
      let modules = req.params.modules
      let result = await FeedCrawler(url, modules)
      //res.set('Content-Type', 'text/xml')
      setHeader(res)
      res.send(result)
    }
    catch (e) {
      //throw e
      res.send(e)
    }
  })
  
//  app.get('/ft/20211019-2116/feeds/posts/default', async (req, res) => {
//    try {
//      setHeader(res)
//
//      let p = path.resolve(__dirname, './test/ori.xml')
//      let result = fs.readFileSync(p, 'utf8')
//
//
//
//      res.send(result)
//    }
//    catch (e) {
//      res.send(e)
//    }
//  })
  
  app.get('/fc/:url', async (req, res) => {
    try {
      let url = req.params.url
      url = urlFilter(url)
      let result = await NodeCacheSQLite.get('feed-crawler', url, async () => {
        return await FeedCrawler(url)
      }, cacheExpireTime)

      setHeader(res)

      //console.log('a')
      res.send(result)
    }
    catch (e) {
      res.send(e)
    }
  })
  
  app.get('/fc/:modules/:url', async (req, res) => {
    try {
      let url = req.params.url
      url = urlFilter(url)
      let modules = req.params.modules

      let result = await NodeCacheSQLite.get('feed-crawler', url + modules, async () => {
        return await FeedCrawler(url)
      }, cacheExpireTime)
      //res.set('Content-Type', 'text/xml')
      setHeader(res)
      res.send(result)
    }
    catch (e) {
      res.send(e)
    }
  })
}

module.exports = route