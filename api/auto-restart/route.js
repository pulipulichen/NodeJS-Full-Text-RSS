const route = function (app) {
  
  app.get('/e', async (req, res) => {
    try {
      throw new Error('test exception')
    }
    catch (e) {
      res.send(e)
    }
  })
}

module.exports = route