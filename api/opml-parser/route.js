const OPMLParser = require('./OPMLParser.js')

const route = function (app) {
  app.get('/opml', async (req, res) => {
    let result = true
    res.send(result)
  })
  
}

module.exports = route