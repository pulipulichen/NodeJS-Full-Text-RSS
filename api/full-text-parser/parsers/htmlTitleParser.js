const decode = require('html-entities').decode

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
  
  title = modules + title

  return title
}

const replaceASCIItoChar = function (title) {
  
  // 課堂學習的最佳Chromebook&#65306;ASUS Chromebook Detachable CZ1 / The Best&#160;Learning partner:&#160;ASUS Chromebook Detachable CZ1 - 布丁布丁吃什麼&#65311;
  //console.log(title)
  //console.log(title.charCodeAt(0))

  //let match = title.match(/\&#([^<]*);/) // regular expression to parse contents of the <title> tag
  //console.log(match)
  
  //'課堂學習的最佳Chromebook&#65306;ASUS <Chromebook> Detachable CZ1 / The Best&#160;Learning partner:&#160;ASUS <Chromebook> Detachable CZ1 - 布丁布丁吃什麼&#65311;'.replace(/(&#([\d]+);)/ig, (a) => '||')

  // 課堂學習的最佳Chromebook：ASUS Chromebook Detachable CZ1 / The Best Learning partner: ASUS Chromebook Detachable CZ1 - 布丁布丁吃什麼？

  return title.replace(/(&#([\d]+);)/ig, (code) => {
//    let pos = code.indexOf(';')
//    if (pos > -1) {
//      code = code.slice(0, pos + 1)
//    }
    let codeNumber = Number(code.slice(2, -1))
    console.log(code, codeNumber)
    if (isNaN(codeNumber)) {
      return code
    }
    else {
      return String.fromCharCode(codeNumber)
    }
  })
}

module.exports = htmlTitleParser
