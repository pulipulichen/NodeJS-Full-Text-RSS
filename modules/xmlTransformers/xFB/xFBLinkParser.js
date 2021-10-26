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
    let container = $(':not(._79v0) section._2rea._24e1._412_._bpa._vyy._5t8z')
    if (container.length > 0) {
      aList = container.eq(0).find('a._4qxt[href^="https://lm.facebook.com/l.php?u=http"]')
    }
    //aList = $('body:first ._5rgu._7dc9 section._2rea._24e1._412_._bpa._vyy._5t8z a._4qxt[href^="https://lm.facebook.com/l.php?u=http"]')
    //console.log($('body:first ._5rgu._7dc9 section._2rea._24e1._412_._bpa._vyy._5t8z').length)
  } 
//  else {
//    aList = $('a[href^="https://lm.facebook.com/l.php?u=http"]')
//  }
  
//  console.log($.html().indexOf('my-dress-up-darling-animation-release-in-2022-spring&'))
//  if ($.html().indexOf('my-dress-up-darling-animation-release-in-2022-spring&')) {
//    let h = $.html()
//    let pos = h.indexOf('my-dress-up-darling-animation-release-in-2022-spring&')
//    console.log(h.slice(pos-500, pos+500))
//  }
  //console.log(aList.length)
  
  //console.log('=============================')
  //console.log($.html())
  //console.log('=============================')
  
  let outputURL
  for (let j = 0; j < aList.length; j++) {
    //console.log(j, aList.eq(j).attr('href'), aList.eq(j).text())
    //console.log(j, aList.eq(j).attr('href'))
    
    let parentsList = aList.eq(j).parents()
    let output = []
    let hasDenyParent = false
    for (let j = 0; j < parentsList.length; j++) {
      let outerHTML= parentsList.eq(j).prop('outerHTML').slice(0, 100)
      if (outerHTML.startsWith('<div class="_79v0"')) {
        hasDenyParent = true
        break
      }
      output.push(outerHTML)
    }
    
    if (hasDenyParent) {
      continue
    }
    
    console.log(output.length, output.join('\n'))
    
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