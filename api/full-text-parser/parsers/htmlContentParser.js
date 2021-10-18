
const cheerio = require('cheerio')

const PrependProtocol = require('./contentModifiers/PrependProtocol.js')
const PrependRelativeURI = require('./contentModifiers/PrependRelativeURI.js')
const TrimEmptyElement = require('./contentModifiers/TrimEmptyElement.js')
const RemoveComments = require('./contentModifiers/RemoveComments.js')
const DelazyLoadingImg = require('./contentModifiers/DelazyLoadingImg.js')

const ModuleManager = require('./../../lib/ModuleManager/ModuleManager.js')

const htmlContentParser = async function (html, modules, url) {
  if (typeof(html) === 'object' && typeof(html.content) === 'string') {
    html = html.content
  }
  
  const $ = cheerio.load(html); // 載入 body
  
  let selectors = [
    'section.article-content__editor:first',
    'article .post-body',
    '.post-body',
    '.article-detail > .content',
    '.user-comment-block',  // https://www.eprice.com.tw/mobile/talk/4693/5681359/1/
    '#git-readme .file_content.markdown-body:first',
    '[itemprop="articleBody"] > div.section',
    '[itemprop="articleBody"]',
    'div.p_mainnew',
    'article:first',
    '#main-container',
    'body'
  ]
  
  let content
  for (let i = 0; i < selectors.length; i++) {
    let element = $(selectors[i])
    //console.log(selectors[i], element.length)
    if (element.length === 0) {
      continue
    }
    
    content = element.html().trim()
    break
  }
  
  // ----------------------
  // 基本處理
  
  content = PrependProtocol(content)
  content = PrependRelativeURI(content, url)
  content = TrimEmptyElement(content)
  content = RemoveComments(content)
  content = DelazyLoadingImg(content)
  
  // -----------------
  // 模組處理
  
  if (typeof(content) !== 'string') {
    content = content('body > div').html()
  }
  
  content = await ModuleManager(content, modules, 'c')

  return content
}

module.exports = htmlContentParser