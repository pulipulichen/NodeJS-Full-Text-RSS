
const cheerio = require('cheerio')
const PrependProtocol = require('./contentModifiers/PrependProtocol.js')

const ModuleManager = require('./../../lib/ModuleManager/ModuleManager.js')

const htmlContentParser = async function (html, modules) {
  const $ = cheerio.load(html); // 載入 body
  
  let selectors = [
    'article:first'
  ]
  
  let content
  for (let i = 0; i < selectors.length; i++) {
    let element = $(selectors[i])
    if (element.length === 0) {
      continue
    }
    
    content = element.html().trim()
    break
  }
  
  // ----------------------
  // 基本處理
  
  content = PrependProtocol(content)
  
  // -----------------
  // 模組處理
  
  content = await ModuleManager(content, modules, 'c')

  return content
}

module.exports = htmlContentParser