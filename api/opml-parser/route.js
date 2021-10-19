const OPMLParser = require('./OPMLParser.js')

const route = function (app) {
  app.get('/opml', async (req, res) => {
    let result = await OPMLParser()
    res.send(result)
  })
  
}

module.exports = route