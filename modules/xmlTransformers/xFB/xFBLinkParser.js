const cheerio = require('cheerio')

const xFBLinkParser = function ($) {
  if (typeof($) === 'string') {
    $ = cheerio.load($)
  }
  
  //console.log(html.indexOf('https://l.facebook.com/l.php'))
  let aList = $('._6ks:first a[href^="https://l.facebook.com/l.php?u=http"]')
  if (aList.length === 0) {
    aList = $('._5rgu:first a[href^="https://lm.facebook.com/l.php?u=http"]')
  }
  if (aList.length === 0) {
    aList = $('a._4qxt[href^="https://lm.facebook.com/l.php?u=http"]:first')
  }
  //console.log($.html().indexOf('ani.gamer.com'))
  //console.log(aList.length)
  
  //console.log('=============================')
  //console.log($.html())
  //console.log('=============================')
  
  let outputURL
  for (let j = 0; j < aList.length; j++) {
    ///console.log(j, aList.eq(j).attr('href'), aList.eq(j).text())
    let aTag = aList.eq(j)
    let href = aTag.attr('href')
    linkToURL = href.slice(href.indexOf('l.php?u=') + 8)
    linkToURL = decodeURIComponent(linkToURL)

    if (linkToURL.startsWith('https://www.instagram.com/')) {
      continue
    }

    let pos = linkToURL.indexOf('?utm_source=Facebook&')
    if (pos > -1) {
      linkToURL = linkToURL.slice(0, pos)
    }
    pos = linkToURL.indexOf('&h=')
    if (pos > -1) {
      linkToURL = linkToURL.slice(0, pos)
    }

    //console.log(j, linkToURL)
    outputURL = linkToURL
    break
  }
  
  return outputURL
}

module.exports = xFBLinkParser