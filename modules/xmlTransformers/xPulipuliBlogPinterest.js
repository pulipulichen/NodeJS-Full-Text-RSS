const cheerio = require("cheerio")

const mediaThumbnailToContent = function ($) {
  let thumbnails = $(`media\\:thumbnail`)

  for (let i = 0; i < thumbnails.length; i++) {
    let thumbnail = thumbnails.eq(i)
    let thumbnailHTML = thumbnail.prop('outerHTML')
    thumbnailHTML = thumbnailHTML.replace(/media:thumbnail/g, 'media:content')
    thumbnailHTML = thumbnailHTML.replace(/\/>/g, 'type="image/png" medium="image" />')
    thumbnail.after(thumbnailHTML)
  }
  
  return $
}

const xPulipuliBlogPinterest = async function ($, moduleCodesString) {
  
  let thumbnails = $(`media\\:thumbnail[url$="=s72-c"][height="72"][width="72"]`)
  for (let i = 0; i < thumbnails.length; i++) {
    let thumbnail = thumbnails.eq(i)
    
    thumbnail.removeAttr('height')
    thumbnail.removeAttr('width')
    let url = thumbnail.attr('url')
    url = url.slice(0, -6)
    thumbnail.attr('url', url)
  }

  $ = mediaThumbnailToContent($)
  
  return $
}

module.exports = xPulipuliBlogPinterest