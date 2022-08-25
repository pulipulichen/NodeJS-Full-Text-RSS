const cheerio = require('cheerio')

const imgNoLazyLoad = function (postContent) {
  let imgList = postContent.find('img[data-src]')

  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)

    img.attr('src', img.attr('data-src'))
  }
}

const cAgirlsAotterNet = function (content) {
  const $ = cheerio.load(content)

  let postContent = $('.post-content:first')
  imgNoLazyLoad(postContent)

  content = postContent.html().trim()
  return content
}

module.exports = cAgirlsAotterNet