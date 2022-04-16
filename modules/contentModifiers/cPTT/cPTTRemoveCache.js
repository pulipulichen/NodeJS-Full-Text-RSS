
const cPTTRemoveCache = function ($) {
  // https://cache.ptt.cc/c/https/i.imgur.com/5IQ00bTl.jpg?e=1650134111&s=0via5tlFfLN5Jed1DD4i2w
  // https://i.imgur.com/5IQ00bT.jpg

  let imgurList = $('img[src^="https://cache.ptt.cc/c/"]')
  
  //console.log(imgurList.length)
  
  for (let i = 0; i < imgurList.length; i++) {
    let tag = imgurList.eq(i)
    
    let link = tag.attr('src')
    if (!link) {
      continue
    }

    if (link.indexOf('https/', 10) > -1) {
      link = link.slice(link.indexOf('https/', 10) + 6)
    }
    else if (link.indexOf('http/', 10) > -1) {
      link = link.slice(link.indexOf('http/', 10) + 5)
    }
    if (link.indexOf('?') > -1) {
      link = link.slice(0, link.indexOf('?'))
    }

    // 嘗試找尋
    if ($('img[src*="' + link + '"]').length > 0) {
      if (tag.parent().children().length === 1) {
        tag.parent().remove()
      }
      else {
        tag.remove()
      }
    } 
  }
}

module.exports = cPTTRemoveCache