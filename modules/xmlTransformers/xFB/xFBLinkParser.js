const xFBLinkParser = function ($) {
  //console.log(html.indexOf('https://l.facebook.com/l.php'))
  let aList = $('._6ks a[href^="https://l.facebook.com/l.php?u=http"]')
  if (aList.length === 0) {
    aList = $('a[href^="https://lm.facebook.com/l.php?u=http"]')
  }
  
  let outputURL
  for (let j = 0; j < aList.length; j++) {
    console.log(j, aList.eq(j).attr('href'))
    let href = aList.eq(j).attr('href')
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