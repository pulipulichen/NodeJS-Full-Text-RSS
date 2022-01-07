const cheerio = require('cheerio')

const ImgurUpload = require('./../../api/lib/image/ImgurUpload.js')

const cImgur = async function (content) {
//  console.log('================')
//  console.log(content)
//  console.log('================')
  
  const $ = cheerio.load(content)
  
  let imgList = $(`img[src]`)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    let src = img.attr('src')
    let imgurURL = await ImgurUpload(src)
    //console.log('cImgur', src, imgurURL)
    img.attr('src', imgurURL)
  }
  
  content = $('body').html()
  //console.log('================')
  //console.log(content)
  //console.log('================')
  return content
}

module.exports = cImgur