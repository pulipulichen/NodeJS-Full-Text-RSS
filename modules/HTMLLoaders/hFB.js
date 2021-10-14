const HtmlLoader = require('./../../api/lib/HtmlLoader/PuppeterHTMLLoader.js')
const xFBLinkParser = require('./../xmlTransformers/xFB/xFBLinkParser.js')
const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')

const cheerio = require('cheerio')

const ExtractTitleFromContent = function (content) {
  let title = content
  let pos = title.indexOf('\n')
  if (pos > -1) {
    title = title.slice(0, pos).trim()
    content = content.slice(pos).trim()
  }
  else {
    let $ = cheerio.load(title)
    title = $('p:first').text().trim()
    $('p:first').remove()
    content = $.html()
  }
  return {
    title,
    content
  }
}

const hFB = async function (url) {
  let originalURL = url
  if (url.startsWith('https://www.facebook.com/')) {
    url = 'https://m.facebook.com/' + url.slice(25)
  }
  
  let html = await HtmlLoader(url)
  
  // 需要判斷類型
  let link = await xFBLinkParser(html)
  //console.log('FB Link: ', link)
  let title
  let extendHTML
  
  console.log('影片有問題')
  
  // 我需要取出原本的內容
  let $ = cheerio.load(html)
  let content = $('._5rgt > div').html()

  //console.log(html)
  if (link) {
    //console.log(link)
    let linkedData = await fullTextParser(link)
    //console.log(linkedData)
    if (linkedData) {
      title = linkedData.title
      extendHTML = linkedData.content
      
      content = `<a href="${originalURL}" target="_blank">${originalURL}</a><br />\n` 
        + content 
        + '\n<hr />\n' + extendHTML
    }
  }
  else {
    let output = ExtractTitleFromContent(content)
    title = output.title
    content = output.content
  }
  
  
  
  return {
    title,
    content
  }
}

module.exports = hFB