//const cheerio = require('cheerio')
const StripHTML = require('./../../api/lib/stringUtils/StripHTML.js')

const cTechbang = function (content) {
  //const $ = cheerio.load(content)
  
  /*
  let icon = $('div.talk_time > .icon_float > a').clone()
  
  $('div.talk_time').before(icon)
  $('div.talk_time').before('<br />')
  $('div.talk_time').remove()
  //$('div.talk_time').append('<br /><hr /><br />')
  content = $.html().trim()
   * 
   */
  //console.log(content.slice(0, 100))
  
  if (content.indexOf('<p>') > -1) {
    let pos = content.indexOf('<p>')
    let beforePTag = content.slice(0, pos).trim()
    if (beforePTag.endsWith('。')) {
      beforePTag = beforePTag.slice(0, -1)
    }
    
    //console.log(beforePTag)
    let afterPTag = content.slice(pos + 3).trim()
    let afterPTagText = StripHTML(afterPTag)
    //console.log(afterPTagText.slice(0,100))
    if (afterPTagText.startsWith(beforePTag)) {
      content = afterPTag
    }
  }
  
  return content
}

module.exports = cTechbang