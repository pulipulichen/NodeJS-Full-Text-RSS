const cheerio = require('cheerio')

//var config = require('./../../../mount/config.js')

const ImgurUpload = require('./../../../api/lib/image/ImgbbUpload.js')

//imgur.setClientID(config.Imgur.ClientID);

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
  //console.log('img list 2', imgList2.length)
  for (let i = 0; i < imgList2.length; i++) {
    //break
    let img = imgList2.eq(i)
    let src = img.attr('src')
    if (!src) {
      continue
    }
    
    //continue // 先放棄使用imgur
    //console.log('src', src)
    let imgurURL = await ImgurUpload(src)
    //console.log('imgurURL', imgurURL)
    if (imgurURL) {
      img.attr('src', imgurURL)
    }
  }
  
  let output = $('body > div').html()
  //console.log(output)
  
  return output
}

module.exports = DesafeImg