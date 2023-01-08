// https://blog.pulipuli.info/feeds/posts/default
const cheerio = require('cheerio')

// const textLimit = 5000
const textLimit = 130

const cPulipuliBlogTwitter = function (content, code, $) {
  

  // if (typeof($.find) === 'function') {
  //   $ = $.find
  // }
  // let url = $('link[rel="alternate"][type="text/html"][href]:first').attr('href')
  let url = ''
  try {
    url = $.find('link[rel="alternate"][type="text/html"][href]:first').attr('href')
  }
  catch (e) {
    url = e
  }

  let title = ''
  try {
    title = $.find('link[rel="alternate"][type="text/html"][href]:first').attr('title')
  }
  catch (e) {
    title = e
  }


  // -------------

  let container = cheerio.load(content);
  let text = []
  let pList = container('p,hr,h2,h3,h4,ul,ol')
  let isOverflowed = false
  for (let i = 0; i < pList.length; i++) {
    let p = pList.eq(i)

    let tagName = p.prop('tagName').toLowerCase()
    if (tagName === 'hr') {
      text.push('--')

      continue
    }
    else if (tagName === 'ol' || tagName === 'ul') {
      let liElementList = p.children('li')

      let liTextList = []
      for (let i = 0; i < liElementList.length; i++) {
        let liText = liElementList.eq(i).text().trim()
        if (tagName === 'ol') {
          liText = i + '. ' + liText
        }
        else {
          liText = '- ' + liText
        }
        liTextList.push(liText)
      }
      text.concat(liTextList)
      continue
    }

    let t = p.text().trim()

    if (tagName === 'h2') {
      t = '# ' + t
    }
    else if (tagName === 'h3') {
      t = '## ' + t
    }
    else if (tagName === 'h4') {
      t = '### ' + t
    }
    
    text.push(t)
    
    if (text.join('').length > textLimit) {
      text = text.slice(0, -1)

      while (text[(text.length - 1)].trim() === '--' || text[(text.length - 1)].trim().startsWith('#')) {
        text = text.slice(0, -1)
      }
      isOverflowed = true
      break
    }
  }

  if (!isOverflowed) {
    while (text[(text.length - 1)].trim() === '--' || text[(text.length - 1)].trim().startsWith('#')) {
      text = text.slice(0, -1)
    }
  }

  // -------------------
  
  let categories = []
  try {
    // categories = $.find('link[rel="alternate"][type="text/html"][href]:first').attr('href')
    let html = $.html()
    html = html.slice(0, html.indexOf('<title '))
    let parts = html.split(`<category scheme="http://www.blogger.com/atom/ns#" term="`)
    for (let i = 1; i < parts.length; i++) {
      let term = parts[i].slice(0, parts[i].indexOf('"'))
      if (term.indexOf('/') > -1) {
        term = term.slice(term.lastIndexOf('/') + 1).trim()
      } 
      categories.push(term)
    }

    categories = categories.filter((v, i, a) => a.indexOf(v) === i)

    if (categories.length > 0) {
      text.push('\n--\n#' + categories.join(' #'))
    }
  }
  catch (e) {
    // categories = e.toString()
  }


  // -----------------

  if (!isOverflowed) {
    while (text[(text.length - 1)].trim() === '--' || text[(text.length - 1)].trim().startsWith('#')) {
      text = text.slice(0, -1)
    }

    // text.push('----\n<br />\n<br />看看網頁版全文 ⇨ ' + title + '\n<br />' + url)
    // text.push('看看網頁版全文 ⇨ ' + title + '\n<br />')
  }
  else {
    // text.push('----\n<br />\n<br />繼續閱讀 ⇨ ' + title + '\n<br />' + url)
    // text.push('繼續閱讀 ⇨ ' + title + '\n<br />')
  }
  
  // ------------
  
  
  // let img = container('img:first')
  // let imgSrc = img.attr('src')
  // let sizePos = imgSrc.lastIndexOf('=s')
  // if (sizePos > -1 && sizePos > imgSrc.length - 10) {
  //   imgSrc = imgSrc.slice(0, sizePos) + '=s1080'
  //   img.attr('src', imgSrc)
  // }
  // else {
  //   imgSrc = imgSrc + '=s1080'
  //   img.attr('src', imgSrc)
  // }

  // imgSrc = typeof(img.length)

  // imgSrc = img.parent().prop('outerHTML')
  // imgSrc = img.eq(0).attr('src')
  // imgSrc = img.length
  // let img = $.find('img:first').parent()
  // text.unshift(img.prop('outerHTML'))

  // ------------
  
  // try {
  //   let categories = $.find('category[scheme="http://www.blogger.com/atom/ns#"][term]')
  //   let terms = []
  //   text.push(categories.length)
  // }
  // catch (e) {
  //   text.push(e)
  // }
    
  // for (let i = 0; i < categories.length; i) {
  //   let term = categories[i].attr('term')
  //   if (term.indexOf('/') > -1) {
  //     term = term.slice(term.lastIndexOf('/') + 1).trim()
  //   }
  //   terms.push(term)
  // }

  // terms = terms.filter((v, i, a) => a.indexOf(v) === i)

  // if (terms.length > 0) {
  //   text.push('#' + terms.join(' #'))
  // }
  
  // -------------------

  text = text.filter(t => (t + '').trim() !== '')

  text = text.join('\n')
  //console.log(text)

  // text = code + text
  // text = '<textarea>' + $.html() + '</textarea>' + text
  
  return text
}

module.exports = cPulipuliBlogTwitter