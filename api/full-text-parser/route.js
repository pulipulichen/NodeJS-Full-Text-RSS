const fullTextParser = require('./fullTextParser.js')

const route = function (app) {
  app.get('/full-text-parser/:url', async (req, res) => {
    let url = req.params.url
    let result = await fullTextParser(url)
    res.send(result)
  })
}

module.exports = route