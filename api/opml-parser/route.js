const OPMLParser = require('./OPMLParser.js')

const route = function (app) {
  app.get('/opml', async (req, res) => {
    let result = await OPMLParser()
    result = JSON.stringify(result, null, '\t')
    res.send(result)
  })
  
}

module.exports = route