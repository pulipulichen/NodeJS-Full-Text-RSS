
const cPTTLoadImgur = function ($) {
  let imgurList = $('a[href^="https://imgur.com/"]')
  
  //console.log(imgurList.length)
  
  for (let i = 0; i < imgurList.length; i++) {
    let aTag = imgurList.eq(i)
    
    let link = aTag.attr('href')
    if (link !== aTag.text().trim()) {
      continue
    }
    
    let id = link.slice(link.lastIndexOf('/') + 1).trim()
    if (id.indexOf('.') > -1) {
      id = id.slice(0, id.indexOf('.'))
    }
    
    let src = 'https://i.imgur.com/' + id + '.png'
    
    aTag.html(`${link}<br /><img src="${src}" style="max-width: 100%; height: auto;" />`)
  }
}

module.exports = cPTTLoadImgur