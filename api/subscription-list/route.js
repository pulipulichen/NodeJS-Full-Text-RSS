const list = require('./../../mount/subscription-list.js')

const route = function (app) {
  app.get('/subscription-list', async (req, res) => {
    res.send(list)
  })
}

module.exports = route