const imgur = require('imgur-upload')
const NodeCacheSqlite = require('./../cache/node-cache-sqlite.js')

const config = require('./../../../mount/config.js')

const os = require('os');
var path = require('path');

var fs = require('fs')
var request = require('request');

const sleep = require('./../async/sleep.js')

imgur.setClientID(config.Imgur.ClientID)

let cacheOnErrorHour = 4
let cacheOnErrorMS = cacheOnErrorHour * 60 * 60 * 1000

const ImgurUpload = async function (src) {
  try {
    let imgurURL = await NodeCacheSqlite.get('imgur', src, async () => {
      return await urlToImgur(src)
    })

    return imgurURL
  }
  catch (e) {
    console.error(src)
    console.error(e)
    
    let imgurURL = await NodeCacheSqlite.get('imgur', src, async () => {
      return src
    }, cacheOnErrorMS)
    return imgurURL
  }
}

async function urlToImgur(url) {
  let ext = '.jpg'
  if (url.endsWith('.gif')) {
    ext = '.gif'
  } else if (url.endsWith('.png')) {
    ext = '.png'
  }

  let tmpFilePath = path.resolve(os.tmpdir() , (new Date()).getTime() + ext)
  return new Promise((resolve, reject) => {
    download(url, tmpFilePath, async function () {
      await sleep(10000)
      
      imgur.upload(tmpFilePath, function (err, res) {
        //console.log(res.data.link); //log the imgur url
        if (!res.data) {
          return reject(res)
        }
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