const FeedCrawler = require('./FeedCrawler.js')

const route = function (app) {
  app.get('/f/:url', async (req, res) => {
    let url = req.params.url
    let result = await FeedCrawler(url)
    res.type('application/xml')
    res.set('Content-Type', 'text/xml');
    //console.log('a')
    res.send(result)
  })
  
  app.get('/f/:modules/:url', async (req, res) => {
    let url = req.params.url
    let modules = req.params.modules
    let result = await FeedCrawler(url, modules)
    //res.set('Content-Type', 'text/xml')
    res.set('Content-Type', 'text/xml');
    res.type('application/xml')
    res.send(result)
  })
}

module.exports = route