const request = require('request');

const FeedURLFilter = require('./../feed-crawler/FeedURLFilter.js')

const route = function (app) {
  app.get('/original-rss-crawler/:url', async (req, res) => {
    let url = req.params.url
    url = FeedURLFilter(url)
    req.pipe(request(url).on('error', function(e) {
        console.error(e);
      }), function(error, response, body){
      if (error.code === 'ECONNREFUSED'){
        console.error('Refused connection');
      } else { 
        //throw error; 
        console.error(error)
      }
    }).pipe(res)
  })
}

module.exports = route