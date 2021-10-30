const OPMLParser = require('./OPMLParser.js')

const route = function (app) {
  app.get('/opml', async (req, res) => {
    try {
      let result = await OPMLParser()
      result = JSON.stringify(result, null, '\t')
      res.send(result)
    }
    catch (e) {
      res.send(e)
    }
  })
  
}

module.exports = route