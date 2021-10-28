const FeedTransformer = require('./FeedTransformer.js')
const path = require('path')

const route = function (app) {
  
  app.post('/feed-transformer', async (req, res) => {
    try {
      let feedXML = req.body.feedXML
      let result = await FeedTransformer(feedXML)
      res.send(result)
    }
    catch (e) {
      res.send(e)
    }
  })
  
  app.post('/feed-transformer/:modules', async (req, res) => {
    try {
      let feedXML = req.body.feedXML
      let modules = req.params.modules
      //console.log(feedXML)
      let result = await FeedTransformer(feedXML, modules)
      res.send(result)
    }
    catch (e) {
      res.send(e)
    }
  })
}

module.exports = route