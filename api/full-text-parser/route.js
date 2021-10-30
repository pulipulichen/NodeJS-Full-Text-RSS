const fullTextParser = require('./fullTextParser.js')

const route = function (app) {
  app.get('/full-text-parser/:url', async (req, res) => {
    try {
      let url = req.params.url
      let result = await fullTextParser(url)
      res.send(result)
    }
    catch (e) {
      res.send(e)
    }
  })
  
  app.get('/full-text-parser/:modules/:url', async (req, res) => {
    try {
      let url = req.params.url
      let modules = req.params.modules
      let result = await fullTextParser(url, modules)
      res.send(result)
    }
    catch (e) {
      res.send(e)
    }
  })
}

module.exports = route