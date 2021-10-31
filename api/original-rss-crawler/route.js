const request = require('request');

const FeedURLFilter = require('./../feed-crawler/FeedURLFilter.js')
const HtmlLoader = require('./../lib/HtmlLoader/HtmlLoader.js')


const route = function (app) {
  app.get('/original-rss-crawler/:url', async (req, res) => {
    try {
      let url = req.params.url
      url = FeedURLFilter(url)
      
      /*
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
       */
      let content = await HtmlLoader(url)
      content = content.split('&nbsp;').join(' ')
      //content = content.split('&lt;').join('<')
        
      res.send(content)
    }
    catch (e) {
      //console.log(e)
      res.send(e.message)
    }
  })
}

module.exports = route