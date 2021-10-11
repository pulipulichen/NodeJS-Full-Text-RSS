const FeedTransformer = require('./FeedTransformer.js')

const route = function (app) {
  app.post('/feed-transformer', async (req, res) => {
    let feedXML = req.body.feedXML
    let result = await FeedTransformer(feedXML)
    res.send(result)
  })
  
  app.post('/feed-transformer/:modules', async (req, res) => {
    let feedXML = req.body.feedXML
    let modules = req.params.modules
    console.log(feedXML)
    let result = await FeedTransformer(feedXML, modules)
    res.send(result)
  })
}

module.exports = route