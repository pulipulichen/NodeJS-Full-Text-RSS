/* global __dirname */

var imgur = require('imgur-upload'),
path = require('path');

imgur.setClientID('');
imgur.upload(path.join(__dirname, './public/img/icon/favicon.png'),function(err, res){
	console.log(res.data.link); //log the imgur url
});