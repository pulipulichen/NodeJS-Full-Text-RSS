
const cheerio = require('cheerio')

const PrependProtocol = require('./contentModifiers/PrependProtocol.js')
const TrimEmptyElement = require('./contentModifiers/TrimEmptyElement.js')
const RemoveComments = require('./contentModifiers/RemoveComments.js')

const ModuleManager = require('./../../lib/ModuleManager/ModuleManager.js')

const htmlContentParser = async function (html, modules) {
  const $ = cheerio.load(html); // 載入 body
  
  let selectors = [
    'section.article-content__editor:first',
    'article:first'
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
  content = TrimEmptyElement(content)
  content = RemoveComments(content)
  
  // -----------------
  // 模組處理
  
  if (typeof(content) !== 'string') {
    content = content('body > div').html()
  }
  
  content = await ModuleManager(content, modules, 'c')

  return content
}

module.exports = htmlContentParser