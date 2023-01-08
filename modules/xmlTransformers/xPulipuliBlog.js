const cheerio = require("cheerio")

const xPulipuliBlog = async function ($, moduleCodesString) {
  
  // let thumbnails = $(`media\\:thumbnail[url$="=s72-c"][height="72"][width="72"]`)
  // for (let i = 0; i < thumbnails.length; i++) {
  //   let thumbnail = thumbnails.eq(i)
    
  //   thumbnail.removeAttr('height')
  //   thumbnail.removeAttr('width')
  //   let url = thumbnail.attr('url')
  //   url = url.slice(0, -6)
  //   thumbnail.attr('url', url)
  // }

  await FeedItemEach($, async (item, i) => {
    FeedItemSetContent(item, 'ok')
  })
  
  return $
}

module.exports = xPulipuliBlog