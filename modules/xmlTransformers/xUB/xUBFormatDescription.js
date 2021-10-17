const timestampify = require('./timestampify.js')

const linkifyHtml = require('linkify-html')

const cheerio = require('cheerio')

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
  
  
  let linkifyHTMLContent = linkifyHtml(content).trim()
  
  
  
  return linkifyHTMLContent
}

module.exports = xUBFormatDescription