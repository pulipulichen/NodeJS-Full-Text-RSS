const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const FeedItemGetLink = require('./../../api/lib/xmlTransformers/FeedItemGetLink.js')
const FeedItemGetContent = require('./../../api/lib/xmlTransformers/FeedItemGetContent.js')
const FeedItemSetContent = require('./../../api/lib/xmlTransformers/FeedItemSetContent.js')

const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')

const minTitleLength = 20
const maxTitleLength = minTitleLength * 5
const linkifyHtml = require('linkify-html')

const cheerio = require('cheerio')

const ImageStyler = function (content) {
  const $ = cheerio.load('<div>' + content + '</div>')
  
  let imgList = $('img')
  //console.log(imgList.length)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    img.removeAttr('width')
    img.removeAttr('height')
    img.css({
      'max-width': '100%',
      'height': 'auto'
    })
  }
  
  let output = $('body > div').html().trim()
  //console.log(output)
  
  return output
}

const parseMediaImage = function (item) {
  let mediaImages = item.find('media\\:content[medium="image"]')
  
  let output = []
  for (let i = 0; i < mediaImages.length; i++) {
    let image = mediaImages.eq(i)
    let url = image.attr('url')
    output.push(`<img src="${url}" style="max-width: 100%; height: auto;" />`)
  }
  
  return output.join('<br />\n')
}

const xTwitter = async function ($, moduleCodesString) {
  await FeedItemEach($, async (item, i) => {
    //console.log(i, item.find('title').text())
    //item.remove()
    
    //let link = FeedItemGetLink(item)
    //let {content} = await fullTextParser(link, moduleCodesString)
    //console.log(i, content)
    //FeedItemSetContent(item, content)
    
    let title = item.find('title:first').text().trim()
    if (title.endsWith('...')) {
      title = title.slice(0, -3)
    }
    
    let sampleTitle = title
    if (sampleTitle.indexOf(' https://') > -1) {
      sampleTitle = sampleTitle.slice(0, sampleTitle.indexOf(' https://')).trim()
    }
    let content = FeedItemGetContent(item)
    
    content = content.split('<br/>').join('\n')
    content = content.replace(/<[^>]+>/g, '').trim()
    
    //console.log('[title]', content.startsWith(sampleTitle), sampleTitle, content)
    if (content.startsWith(sampleTitle)) {
      //console.log('[title]', title)
      
      title = content.trim()
      //console.log('[title]', title.length, title)
      if (title.length > minTitleLength) {
        let newLinePos = title.indexOf('\n', minTitleLength)
        //console.log('n', newLinePos)
        
        if (newLinePos === -1 || newLinePos > maxTitleLength) {
          newLinePos = title.indexOf('!', minTitleLength) + 1
          //console.log('n2', newLinePos)
        }
        if (newLinePos === 0 || newLinePos > maxTitleLength) {
          
          newLinePos = title.indexOf('. ', minTitleLength) + 1
          //console.log('n4', newLinePos)
        }
        if (newLinePos === 0 || newLinePos > maxTitleLength) {
          
          newLinePos = title.indexOf('? ', minTitleLength) + 1
          //console.log('n4', newLinePos)
        }
        
        if (newLinePos === 0 || newLinePos > maxTitleLength) {
          
          newLinePos = title.indexOf(' ', minTitleLength)
          //console.log('n3', newLinePos)
        }
        if (newLinePos === -1 || newLinePos > maxTitleLength) {
          
          newLinePos = title.length
        }
        //console.log('newLinePos', newLinePos)
        title = title.slice(0, newLinePos).trim()
      }
      
      content = content.slice(title.length).trim()
      
      content = linkifyHtml(content.trim().split('\n').join('<br>\n').trim())
      content = ImageStyler(content)
      
      let mediaImage = parseMediaImage(item)
      
      if (mediaImage !== '') {
        content = content + '<br />\n' + mediaImage
      }
      
      title = title.split('\n').join(' ').trim()
      
      item.find('title:first').text(title)
      FeedItemSetContent(item, content)
    }
    
  })
  
  return $
}

module.exports = xTwitter