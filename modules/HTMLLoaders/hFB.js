const HtmlLoader = require('./../../api/lib/HtmlLoader/PuppeterHTMLLoader.js')
const xFBLinkParser = require('./../xmlTransformers/xFB/xFBLinkParser.js')
const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')

const cheerio = require('cheerio')

const ExtractTitleFromContent = function (content) {
  if (!content || typeof(content) !== 'string') {
    throw Error('Content is not defiend')
  }
  
  let title = content
  let pos = title.indexOf('\n')
  if (pos > -1) {
    title = title.slice(0, pos).trim()
    content = content.slice(pos).trim()
  }
  else if (title.indexOf('<br') > -1) {
    let $ = cheerio.load(title)
    let firstBr = $('br:first')
    let parentElement = firstBr.parent()
    let parentHTML = parentElement.html()
    let beforeBr = parentHTML.slice(0, parentHTML.indexOf('<br'))
    title = cheerio.load('<div>' + beforeBr.trim() + '</div>')('body > div').text()
    
    // -------------
    
    let parentContents = parentElement.contents()
    for (let i = 0; i < parentContents.length; i++) {
      let child = parentContents.eq(i)
      //console.log(child)
      let tagName = child.prop('tagName')
      //console.log(tagName)
      if (tagName === 'BR') {
        break
      }
      else {
        child.remove()
      }
    }
    
    // -------------
    
    let contentText = $('body').text().trim()
    
    if (contentText === '') {
      content = ''
    }
    else {
      content = $('body').html()
    }
  }
  else if (title.indexOf('<p') > -1) {
    let $ = cheerio.load(title)
    title = $('p:first').text().trim()
    $('p:first').remove()
    
    let contentText = $('body').text().trim()
    
    if (contentText === '') {
      content = ''
    }
    else {
      content = $('body').html()
    }
  }
  else if (content.length > 10) {
    title = content.slice(0, 10) + '...'
  }
  else {
    title = content
    content = '(no content)'
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
  
  //console.log('影片有問題')
  
  // 我需要取出原本的內容
  let $ = cheerio.load(html)
  let contentElement = $('._5rgt ._1-sk:first') 
  //console.log(contentElement.length)
  if (contentElement.length === 0) {
    contentElement = $('._5rgt > div')
  }
  else if (contentElement.length === 0) {
    contentElement = $('._9dj5 > ._9dgu > div')
  }
  let content = contentElement.html()

  //console.log(link)
  //console.log(content)
  
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
  
  //console.log('title', title)
  //console.log('content', content)
  
  return {
    title,
    content
  }
}

module.exports = hFB