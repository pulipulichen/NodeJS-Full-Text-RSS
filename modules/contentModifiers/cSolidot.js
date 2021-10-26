const cheerio = require('cheerio')

const cSolidot = function (content) {
  const $ = cheerio.load(content)
  
  let icon = $('div.talk_time > .icon_float > a').clone()
  
  $('div.talk_time').before(icon)
  $('div.talk_time').before('<br />')
  $('div.talk_time').remove()
  //$('div.talk_time').append('<br /><hr /><br />')
  content = $.html().trim()
  return content
}

module.exports = cSolidot