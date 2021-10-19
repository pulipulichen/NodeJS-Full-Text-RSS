const FeedTransformer = require('./FeedTransformer.js')
const path = require('path')
const favicon = require('serve-favicon');

const route = function (app) {
  app.use(favicon(path.resolve(__dirname, './Saki-NuoveXT-Apps-demo.ico')));
  
  app.post('/feed-transformer', async (req, res) => {
    let feedXML = req.body.feedXML
    let result = await FeedTransformer(feedXML)
    res.send(result)
  })
  
  app.post('/feed-transformer/:modules', async (req, res) => {
    let feedXML = req.body.feedXML
    let modules = req.params.modules
    //console.log(feedXML)
    let result = await FeedTransformer(feedXML, modules)
    res.send(result)
  })
}

module.exports = route