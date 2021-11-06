const cheerio = require('cheerio')

const cIamjoyhuang = function (content) {
  
  const $ = cheerio.load(content)
  
  //console.log(content)
  $('div.entry-meta.cf').remove()
  $('h1.entry-title').remove()
  $('#jp-post-flair').remove()
  
  let header = $('header.entry-header:first')
  header.after('<hr />')
  header.after(header.children())
  header.remove()
  
  let contentwrap = $('.contentwrap:first')
  contentwrap.after($('#entry-content').children())
  contentwrap.remove()
  
  content = $.html().trim()
  
  return content
}

module.exports = cIamjoyhuang