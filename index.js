const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/full/:rss_url', async (req, res) => {
  var rssURL = req.params.rss_url;
  
  // "https://expressjs.com/zh-tw/starter/hello-world.html"
  // encodeURIComponent
  
  res.send('Hello World!: ' + rssURL)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
