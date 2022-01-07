const imgur = require('imgur-upload')
const NodeCacheSqlite = require('./../cache/node-cache-sqlite.js')

const config = require('./../../../mount/config.js')

const os = require('os');
var path = require('path');

var fs = require('fs')
var request = require('request');

imgur.setClientID(config.Imgur.ClientID)

const ImgurUpload = async function (src) {
  let imgurURL = await NodeCacheSqlite.get('imgur', src, async () => {
    return await urlToImgur(src)
  })

  return imgurURL
}

async function urlToImgur(url) {
  let ext = '.jpg'
  if (url.endsWith('.gif')) {
    ext = '.gif'
  } else if (url.endsWith('.png')) {
    ext = '.png'
  }

  let tmpFilePath = path.resolve(os.tmpdir() , (new Date()).getTime() + ext)
  return new Promise(resolve => {
    download(url, tmpFilePath, function () {
      imgur.upload(tmpFilePath, function (err, res) {
        //console.log(res.data.link); //log the imgur url
        resolve(res.data.link)
      });
    })
  })
}

var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    //console.log('content-type:', res.headers['content-type']);
    //console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

module.exports = ImgurUpload