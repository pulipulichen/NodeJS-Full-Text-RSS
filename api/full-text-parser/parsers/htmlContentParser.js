
const cheerio = require('cheerio')

const PrependProtocol = require('./contentModifiers/PrependProtocol.js')
const PrependRelativeURI = require('./contentModifiers/PrependRelativeURI.js')
const TrimEmptyElement = require('./contentModifiers/TrimEmptyElement.js')
const RemoveComments = require('./contentModifiers/RemoveComments.js')
const DelazyLoadingImg = require('./contentModifiers/DelazyLoadingImg.js')
const DesafeImg = require('./contentModifiers/DesafeImg.js')
const RemoveAds = require('./contentModifiers/RemoveAds.js')
const RemoveScripts = require('./contentModifiers/RemoveScripts.js')
const RemoveShare = require('./contentModifiers/RemoveShare.js')

const ModuleManager = require('./../../lib/ModuleManager/ModuleManager.js')

const htmlContentParser = async function (html, modules, url) {
  if (!html) {
    console.error('No html', url, modules)
    return ''
  }
  
  if (typeof(html) === 'object' && typeof(html.content) === 'string') {
    html = html.content
  }
  
  const $ = cheerio.load(html); // 載入 body
  
  let selectors = [
    'section.article-content__editor:first',
    'article .post-body',
    //'#product-view-container .product-main-description article:first',
    'main.site-main div.card-body div.post-content',
    'div.articles',
    'div#content > div.post > div.entry-content',
    'div.grid__item--10-cols--gt-md',
    'article .td-ss-main-content .td-post-content',
    'article > .post-inner > .entry > .entry-inner',
    'article > div.entry__content',
    'div#post-center-col > [data-testid="PostContentContainer"] > div',
    'div.article-content',
    'article > div.entry-content',
    //'article div.contentwrap #socialicons-sticky #entry-content',
    '.post-body',
    '.article-detail > .content',
    '.user-comment-block',  // https://www.eprice.com.tw/mobile/talk/4693/5681359/1/
    '#git-readme .file_content.markdown-body:first',
    '[itemprop="articleBody"] > div.section',
    '[itemprop="articleBody"]',
    '[itemprop="articleBody mainEntityOfPage"]',
    'div.p_mainnew',
    'div.item-page.blog',
    'article.render-content:first',
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
  
//  
//  if (url === 'https://www.eprice.com.tw/mobile/talk/4541/5682493/1/') {
//    console.log(content)
//  }
//  
  
  //content = TrimEmptyElement(content)
  
  
  content = RemoveComments(content)
  content = await RemoveShare(content)
  content = RemoveScripts(content)
  
  
  content = await DelazyLoadingImg(content, url)
  content = DesafeImg(content)
  
//  
//  if (url === 'https://www.eprice.com.tw/mobile/talk/4541/5682493/1/') {
//    console.log(content.html())
//  }
//  
  
  content = RemoveAds(content)
  
  // -----------------
  // 模組處理
  
  if (typeof(content) !== 'string') {
    content = content('body > div').html()
  }
  
//  if (url === 'https://www.eprice.com.tw/mobile/talk/4541/5682493/1/') {
//    console.log(content)
//  }
  
  
  content = await ModuleManager(content, modules, 'c')

//  if (url === 'https://www.eprice.com.tw/mobile/talk/4541/5682493/1/') {
//    console.log(content)
//  }
  
  
  return content
}

module.exports = htmlContentParser