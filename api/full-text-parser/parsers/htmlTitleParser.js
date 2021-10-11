const decode = require('html-entities').decode
const ModuleManager = require('./../../lib/ModuleManager/ModuleManager.js')

const replaceASCIItoChar = require('./titleModifiers/replaceASCIItoChar.js')

/**
 * https://stackoverflow.com/a/64052494/6645399
 */
const parseTitle = (body) => {
  let match = body.match(/<title>([^<]*)<\/title>/) // regular expression to parse contents of the <title> tag
  if (!match || typeof match[1] !== 'string')
    throw new Error('Unable to parse the title tag')
  return match[1]
}

const cheerio = require('cheerio')

const htmlTitleParser = async function (html, modules) {
  let title
  try {
    title = parseTitle(html)
  }
  catch (e) {
    const $ = cheerio.load(html); // 載入 body
    
    let selectors = [
      'h1:first',
      'h2:first',
      'h3:first',
      'h4:first',
      'p:first'
    ]

    let title
    for (let i = 0; i < selectors.length; i++) {
      let element = $(selectors[i])
      if (element.length === 0) {
        continue
      }

      title = element.html().trim()
    }
    
  }
  
  // --------------
  
  //title = decodeURIComponent(title)
  title = replaceASCIItoChar(title)
  title = decode(title)

  // -----------------
  // 模組處理
  
  title = await ModuleManager(title, modules, 't')

  return title
}


module.exports = htmlTitleParser
