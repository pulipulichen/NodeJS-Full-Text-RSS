const cheerio = require('cheerio')

const ImgurUpload = require('./../../api/lib/image/ImgurUpload.js')

const cImgur = async function (content) {
  return content  // 先放棄使用
  
//  console.log('================')
//  console.log(content)
//  console.log('================')
  
  const $ = cheerio.load(content)
  
  let imgList = $(`img[src]`)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    let src = img.attr('src')
    try {
      let imgurURL = await ImgurUpload(src)
      //console.log('cImgur', src, imgurURL)
      img.attr('src', imgurURL)
    } catch (e) {
      console.error(src)
      console.error(e)
      return content
    }
  }
  
  content = $('body').html()
  //console.log('================')
  //console.log(content)
  //console.log('================')
  return content
}

module.exports = cImgur