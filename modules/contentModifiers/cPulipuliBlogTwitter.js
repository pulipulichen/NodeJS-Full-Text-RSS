// https://blog.pulipuli.info/feeds/posts/default
const cheerio = require('cheerio')

// const textLimit = 5000
const textLimit = 130

function isURL (str) {
  str = decodeHTMLEntities(str)
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

function decodeHTMLEntities(text) {
  var entities = [
      ['amp', '&'],
      ['apos', '\''],
      ['#x27', '\''],
      ['#x2F', '/'],
      ['#39', '\''],
      ['#47', '/'],
      ['lt', '<'],
      ['gt', '>'],
      ['nbsp', ' '],
      ['quot', '"']
  ];

  for (var i = 0, max = entities.length; i < max; ++i) 
      text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

  return text.trim()
}

const cPulipuliBlogTwitter = function (content, code, $) {
    
  // if (typeof($.find) === 'function') {
  //   $ = $.find
  // }
  // let url = $('link[rel="alternate"][type="text/html"][href]:first').attr('href')
  try {
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
    let pList = container('p,hr,h2,h3,h4,ul,ol,pre,blockquote')
    let isOverflowed = false
    for (let i = 0; i < pList.length; i++) {
      let p = pList.eq(i)

      let tagName = p.prop('tagName').toLowerCase()
      if (tagName === 'hr') {
        text.push('----')

        continue
      }
      else if (tagName === 'ol' || tagName === 'ul') {
        let liElementList = p.children('li')

        let liTextList = []
        for (let i = 0; i < liElementList.length; i++) {
          let liText = liElementList.eq(i).text().trim()
          if (tagName === 'ol') {
            liText = (i+1) + '. ' + liText
          }
          else {
            liText = '- ' + liText
          }
          liTextList.push(liText)
        }
        // liTextList = [
        //   '\n<br />',
        //   ...liTextList,
        //   '\n<br />'
        // ]
        text = text.concat(liTextList)
        continue
      }
      else if (tagName === 'pre') {
        if (p.find('code').length > 0) {
          text.push('[Code...]')
        }
        continue
      }
      else if (tagName === 'blockquote') {
        let quote = p.text().trim()
        quote = '| ' + quote
        text.push(quote)
        continue
      }

      let t = p.text().trim()

      if (isURL(t)) {
        let domain = (new URL(t))
        t = `[URL: ${domain.hostname}]`
      }

      if (tagName === 'h2') {
        t = '# ' + t
      }
      else if (tagName === 'h3') {
        t = '## ' + t
      }
      else if (tagName === 'h4') {
        t = '### ' + t
      }
      
      // text.push(t)
      // 20230109-1126 再分句看看
      if (t.length > 20) {
        let sentence = t.split('。').map(s => {
          s = s.trim()
          if (s !== '') {
            s = s + '。'
          }
          return s
        }).filter(s => s !== '')

        text = text.concat(liTextList)
      }
      else {
        text.push(t)
      }
      
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
  catch (e) {
    return e.toString()
  } 
}

module.exports = cPulipuliBlogTwitter