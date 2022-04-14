const timestampify = require('./timestampify.js')

const linkifyHtml = require('linkify-html')

const cheerio = require('cheerio')
const dayjs = require('dayjs')

const xUBFormatDescription = function (videoID, content) {
  content = timestampify(content)
  
  let lines = content.split('\n')
  let output = []
  lines.forEach(line => {
    if (!line.startsWith('<a data-time="') || line.indexOf('" class="timestamp-link">') === -1) {
      return output.push(line)
    }
    
    let parts = line.split('>')
    
    let timestamp = parts[1]
    timestamp = timestamp.slice(0, timestamp.indexOf('</'))
    //console.log(time)
    //time = Number(time)
    
    let timeParts = timestamp.split(':')
    let second = Number(timeParts[0]) * 60 + Number(timeParts[1])
    
    let header = parts[2].trim()
    
    output.push(`<a data-time="${timestamp}" class="timestamp-link" href="https://yo` + `utu.be/${videoID}?t=${second}">${timestamp} ${header}</a>`)
  })
  
  content = output.join('<br />\n').trim()
  
  
  let linkifyHTMLContent
  if (content.startsWith('<html><head></head><body><div>')) {
    content = content.slice(30)
  }
  
  try {
    linkifyHTMLContent = linkifyHtml(content)
  }
  catch (e) {
    
    content = content.split('&amp;').join('&')
    
    if (linkifyHTMLContent.indexOf('class="timestamp-link"') > -1) {
      linkifyHTMLContent = content
    }
    else {
      try {
        linkifyHTMLContent = linkifyHtml(content)
      }
      catch (e) {
        console.error(`[${dayjs.format('MMDD-HHmm')}] ` + 'Linkifiy error: ')
        console.log(`====
${content}
====`)
        linkifyHTMLContent = content
      }
    }
      
  }
  linkifyHTMLContent = linkifyHTMLContent.trim()
  
  
  
  return linkifyHTMLContent
}

module.exports = xUBFormatDescription