const express = require('express')
const compression = require('compression')

const app = express()

app.use(compression())

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

const FeedCrawler = require('./api/feed-crawler/route.js')
FeedCrawler(app)

const SubscriptionList = require('./api/subscription-list/route.js')
SubscriptionList(app)

const GitPull = require('./api/git-pull/route.js')
GitPull(app)

const OPMLParser = require('./api/opml-parser/route.js')
OPMLParser(app)

app.get('/', async (req, res) => {
  res.redirect('/sub.html')
})

// ------------------------------------------------

app.listen(port, () => {
  let dateString = (new Date()) + ''
  console.log(`App listening at http://localhost:${port} at ${dateString}` )
})
