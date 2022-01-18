const cheerio = require('cheerio')
//const StripHTML = require('./../../api/lib/stringUtils/StripHTML.js')

const cTechbang = function (content) {
  const $ = cheerio.load(content)
  
  let thumb = $('.entry-thumb.single-entry-thumb:first')
  let body = $('.single-content__wrap:first')
  //let body = $('.single-body--content .single-content__wrap:first')
  

  if (body.children().length === 1) {
    body = body.children().eq(0)
  }

  //console.log(thumb.length, body.length)
  if (thumb.length > 0 && body.length > 0) {
    thumb.prop("class", "")
    
    let anchor = body.find('blockquote:first')
    if (anchor.length === 0) {
      anchor = body.find('p:first')
    }
    if (anchor.length === 0) {
      anchor = body.find('div:first')
    }
    anchor.after(thumb)
    //body.prepend(thumb)

    content = body.html().trim()
    //console.log(content.slice(0, 100) , '...', content.slice(-100))
  }
  
  return content
}

module.exports = cTechbang