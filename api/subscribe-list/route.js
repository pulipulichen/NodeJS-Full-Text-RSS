const list = require('./../../subscribe-list.js')

const route = function (app) {
  app.get('/subscribe-list', async (req, res) => {
    res.send(list)
  })
}

module.exports = route