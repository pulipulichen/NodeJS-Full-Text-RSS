const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');

//const nodeCache = require('./lib/cache/node-cache-sqlite.js')
//const inputRSSParser = require('./lib/inputRSSParser/inputRSSParser.js')

app.use(express.static('public'));
app.use(bodyParser.json({limit : '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//app.get('/', async (req, res) => {
//  
//  let cached = await inputRSSParser('https://blog.pulipuli.info/feeds/posts/default')
//  
//  res.send('Hello World!' + cached)
//})
//
//app.get('/full/:rss_url', async (req, res) => {
//  var rssURL = req.params.rss_url;
//  
//  // "https://expressjs.com/zh-tw/starter/hello-world.html"
//  // encodeURIComponent
//  
//  let cached = await nodeCache.get('test', 't', async () => {
//    return 'ok'
//  })
//  
//  res.send('Hello World!: ' + rssURL + cached)
//})

const fullTextParser = require('./api/full-text-parser/route.js')
fullTextParser(app)

const FeedTransformer = require('./api/feed-transformer/route.js')
FeedTransformer(app)

// ------------------------------------------------

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
