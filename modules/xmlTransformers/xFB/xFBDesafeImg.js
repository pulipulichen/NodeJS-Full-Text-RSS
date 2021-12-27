const cheerio = require('cheerio')

var imgur = require('imgur-upload')
var path = require('path');

var fs = require('fs')
var request = require('request');

const NodeCacheSqlite = require('./../../../api/lib/cache/node-cache-sqlite.js')

var config = require('./../../../mount/config.js')

imgur.setClientID(config.Imgur.ClientID);

const DesafeImg = async function (html) {
  //console.log(html)
  
  let $
  if (typeof(html) === 'object' || typeof(html) === 'function') {
    $ = html
  }
  else {
    $ = cheerio.load('<div>' + html + '</div>'); // 載入 body
  }
  
  // -------------------
  //console.log('aaaa')
  
  // https://external-dus1-1.xx.fbcdn.net/safe_image.php?d=AQHD89UyTzKBNIVC&url=https%3A%2F%2Fp2.bahamut.com.tw%2FB%2F2KU%2F86%2F239deeb3a7486b476315bfe0c11dz525.JPG&ext=emg0&_nc_oe=6ed7d&_nc_sid=64c8fc&ccb=3-5&_nc_hash=AQFV1ICQpL9W2Tpx
  let imgList = $(`img[src*=".fbcdn.net/safe_image.php"][src*="&url="]`)
  //console.log(imgList.length)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    let src = img.attr('src')
    
    let urlParams = new URLSearchParams(src);
    let url = urlParams.get('url')
    url = decodeURIComponent(url)
    
    img.attr('src', url)
  }

  let imgList2 = $(`img[src]`)
  console.log('img list 2', imgList2.length)
  for (let i = 0; i < imgList2.length; i++) {
    //break
    let img = imgList2.eq(i)
    let src = img.attr('src')
    if (!src) {
      continue
    }
    console.log('src', src)
    let imgurURL = await NodeCacheSqlite.get('imgur', src, async () => {
      return await urlToImgur(src)
    })
    console.log('imgurURL', imgurURL)
    if (imgurURL) {
      img.attr('src', imgurURL)
    }
  }
  
  let output = $('body > div').html()
  //console.log(output)
  
  return output
}


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

module.exports = DesafeImg