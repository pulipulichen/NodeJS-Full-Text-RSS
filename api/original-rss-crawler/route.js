const request = require('request');

const FeedURLFilter = require('./../feed-crawler/FeedURLFilter.js')
const HtmlLoader = require('./../lib/HtmlLoader/HtmlLoader.js')
const PuppeterHTMLLoader = require('./../lib/HtmlLoader/PuppeterHTMLLoader.js')

function cleanString(input) {
  var output = "";
  for (var i=0; i<input.length; i++) {
      if (input.charCodeAt(i) <= 127) {
          output += input.charAt(i);
      }
  }
  return output;
}


const route = function (app) {
  app.get('/original-rss-crawler/:url', async (req, res) => {
    try {
      let url = req.params.url
      url = FeedURLFilter(url)
      //console.log('original-rss-crawler', url)
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
      let content
      try {
        content = await HtmlLoader(url)
      }
      catch (e) {
        console.error(e)
        content = await PuppeterHTMLLoader(url)
      }
      content = content.split('&nbsp;').join(' ')
      content = content.split('').join(' ')
      //content = cleanString(content)

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