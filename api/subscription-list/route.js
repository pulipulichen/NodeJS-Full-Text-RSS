const list = require('./../../mount/subscription-list.js')

const route = function (app) {
  app.get('/subscription-list', async (req, res) => {
    try {
      res.send(list)
    }
    catch (e) {
      res.send(e)
    }
  })
}

module.exports = route