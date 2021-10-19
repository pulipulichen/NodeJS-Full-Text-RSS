const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const FeedItemGetContent = require('./../../api/lib/xmlTransformers/FeedItemGetContent.js')
const FeedItemSetContent = require('./../../api/lib/xmlTransformers/FeedItemSetContent.js')

const xReddit = async function ($, moduleCodesString) {
  await FeedItemEach($, async (item, i) => {
    let content = FeedItemGetContent(item)
    
    let thumbnail = item.find('media\\:thumbnail:first')
    if (thumbnail.length > 0) {
      let url = thumbnail.attr('url')
      //content = content + `<br /><img src="${url}" />`
      FeedItemSetContent(item, content)
    }
  })
  return $
}

module.exports = xReddit