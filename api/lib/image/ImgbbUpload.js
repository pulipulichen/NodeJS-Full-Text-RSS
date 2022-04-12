const NodeCacheSqlite = require('./../cache/node-cache-sqlite.js')

const config = require('./../../../mount/config.js')

const os = require('os');

const imgbbUploader = require("imgbb-uploader");
const path = require('path')

var fs = require('fs')
var request = require('request');

const sleep = require('./../async/sleep.js')

let cacheOnErrorHour = 4
let cacheOnErrorMS = cacheOnErrorHour * 60 * 60 * 1000

let clientIDIndex = 0

let uploadLock = false

const ImgbbUpload = async function (src) {
  if (typeof(src) !== 'string') {
    console.error('src is not string', src)
    return false
  }

  
  try {
    //console.log('開始圖片', src)
    //await sleep(10000)
    
    let imgbbURL = await NodeCacheSqlite.get('imgbb', src, async () => {
      while (uploadLock) {
        await sleep()
      }
      uploadLock = true

      console.log('Prepare to ImgbbUpload', src)
      let url = await urlToImgbb(src)
      console.log('ImgbbURL', src, url)
      
      uploadLock = false
      return url
    })
    
    return imgbbURL
  }
  catch (e) {
    console.error(src)
    console.error(e)
    
    let imgbbURL = await NodeCacheSqlite.get('imgbb', src, async () => {
      return src
    }, cacheOnErrorMS)
    uploadLock = false
    return imgbbURL
  }
}

async function urlToImgbb(url) {
  /*
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
      
      imgur.setClientID(config.Imgur.ClientID[clientIDIndex])

      imgur.upload(tmpFilePath, function (err, res) {
        //console.log(res.data.link); //log the imgur url
        if (!res.data) {
          clientIDIndex = (clientIDIndex + 1) % config.Imgur.ClientID.length
          console.error('switch client id to ' + clientIDIndex)
          return reject(res)
        }
        resolve(res.data.link)
      });
    })
  })
   * 
   */
  
  const options = {
    apiKey: config.Imgbb.IMGBB_API_KEY[0], // MANDATORY

    //imagePath: "./your/image/path", // OPTIONAL: pass a local file (max 32Mb)

    //name: "yourCustomFilename", // OPTIONAL: pass a custom filename to imgBB API

    expiration: 15552000 /* OPTIONAL: pass a numeric value in seconds.
    It must be in the 60-15552000 range (POSIX time ftw).
    Enable this to force your image to be deleted after that time. */,

    imageUrl: url, // OPTIONAL: pass an URL to imgBB (max 32Mb)

    //base64string:
    //  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVR42mNcLVNbzwAEjDAGACcSA4kB6ARiAAAAAElFTkSuQmCC",
    /* OPTIONAL: pass base64-encoded image (max 32Mb)

    Enable this to upload base64-encoded image directly as string. (available from 1.3.0 onward)
    Allows to work with RAM directly for increased performance (skips fs I/O calls).
    Beware: options.imagePath will be ignored as long as options.base64string is defined! 
    */
  };

  return new Promise((resolve, reject) => {
    imgbbUploader(options)
      .then((response) => {
        resolve(response.url)
        //console.log(response.url)
       })
      .catch((error) => {
        //console.error(error)
        reject(error)
       });
  })
    
}

var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    //console.log('content-type:', res.headers['content-type']);
    //console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

module.exports = ImgbbUpload