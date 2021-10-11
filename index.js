const express = require('express')
const app = express()
const port = 3000

const nodeCache = require('./lib/cache/node-cache-sqlite.js')

app.get('/', async (req, res) => {
  
  let cached = await nodeCache.get('test', 't', async () => {
    return 'ok'
  })
  
  
  res.send('Hello World!' + cached)
})

app.get('/full/:rss_url', async (req, res) => {
  var rssURL = req.params.rss_url;
  
  // "https://expressjs.com/zh-tw/starter/hello-world.html"
  // encodeURIComponent
  
  let cached = await nodeCache.get('test', 't', async () => {
    return 'ok'
  })
  
  res.send('Hello World!: ' + rssURL + cached)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
