const cheerio = require("cheerio")

const xSkip = async function ($, moduleCodesString) {
  
  let thumbnails = $(`media\\:thumbnail[url$="=s72-c"][height="72"][width="72"]`)
  for (let i = 0; i < thumbnails.length; i++) {
    let thumbnail = thumbnails.eq(i)
    
    thumbnail.removeAttr('height')
    thumbnail.removeAttr('width')
    let url = thumbnail.attr('url')
    url = url.slice(0, -6)
    thumbnail.attr('url', url)
  }
  
  let contents = $(`content[type="html"]`)
  for (let i = 0; i < contents.length; i++) {
    let content = contents.eq(i)
    
    let container = cheerio.load(content);
    let text = container('p:first').text()
    content.text(text)
    content.attr('type', 'text')
  }

  return $
}

module.exports = xSkip