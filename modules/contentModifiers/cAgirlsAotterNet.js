const cheerio = require('cheerio')

const imgNoLazyLoad = function (postContent) {
  let imgList = postContent.find('img[data-src]')

  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    let src = img.attr('data-src')

    if (src.startsWith('/')) {
      src = 'https://agirls.aotter.net' + src
      // /media/557f14b4-f7a9-4610-bdfe-72854b0850a6.jpg
      // https://agirls.aotter.net
      // https://agirls.aotter.net/media/557f14b4-f7a9-4610-bdfe-72854b0850a6.jpg
    }

    img.attr('src', src)
    img.removeAttr('data-src')
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