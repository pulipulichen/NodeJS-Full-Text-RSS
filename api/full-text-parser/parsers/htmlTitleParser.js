const decode = require('html-entities').decode
const ModuleManager = require('./../../lib/ModuleManager/ModuleManager.js')

const replaceASCIItoChar = require('./titleModifiers/replaceASCIItoChar.js')
const MailToBlogger = require('./titleModifiers/MailToBlogger.js')

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
  
  
  if (typeof(html) === 'object' && typeof(html.title) === 'string') {
    title = html.title
  }
  else {
    //console.log('htmlTitleParser', html)

    try {
      //console.log('[test]')
      title = parseTitle(html)
      //console.log(title)
      if (!title || title === '') {
        
        throw Error('no <title>')
      }
    }
    catch (e) {
      const $ = cheerio.load(`<div>${html}</div>`); // 載入 body
      //console.log(html)
      let selectors = [
        'h1:first',
        'h2:first',
        'h3:first',
        'h4:first',
        'p:first'
      ]

      //let title
      for (let i = 0; i < selectors.length; i++) {
        let element = $(selectors[i])
        //console.log(selectors[i], element.length)
        if (element.length === 0) {
          continue
        }

        title = element.text().trim()
        //console.log(title)
        break
      }
    }
  }
  
  // --------------
  
  //console.log(1, title)
  title = MailToBlogger(title)
  
  //console.log(2, title)
  
  //title = decodeURIComponent(title)
  title = replaceASCIItoChar(title)
  
  //console.log(3, title)
  
  //console.log(title)
  
  title = decode(title)

  // -----------------
  // 模組處理
  
  title = await ModuleManager(title, modules, 't')
  //console.log(title)
  return title
}


module.exports = htmlTitleParser
