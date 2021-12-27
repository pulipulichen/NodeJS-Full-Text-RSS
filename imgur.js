/* global __dirname */

var imgur = require('imgur-upload')
var path = require('path');

var fs = require('fs')
var request = require('request');

var config = require('./mount/config.js')

imgur.setClientID(config.Imgur.ClientID);

async function urlToImgur(url) {
  let tmpFilePath = '/tmp/' + (new Date()).getTime() + '.jpg'
  return new Promise(resolve => {
	download(url, tmpFilePath, function(){
		imgur.upload(tmpFilePath,function(err, res){
		  //console.log(res.data.link); //log the imgur url
		  resolve(res.data.link)
		});
	})
  })
}

var download = function(uri, filename, callback){
	request.head(uri, function(err, res, body){
	  console.log('content-type:', res.headers['content-type']);
	  console.log('content-length:', res.headers['content-length']);
  
	  request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
};
  
console.log(await urlToImgur('https://scontent-dus1-1.xx.fbcdn.net/v/t39.30808-6/s720x720/260203522_451044079975678_3458594004275259140_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=110474&_nc_ohc=hzqkU6UuUJEAX_D8VAI&_nc_ht=scontent-dus1-1.xx&edm=AJdBtusEAAAA&oh=00_AT_2TRJgFtmF6mjA6fhcS8wT3j0DOAMU1bhDaPXj83n1Xw&oe=61CF56CC'))