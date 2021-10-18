const timestampify = require('./timestampify.js')

const xUBExtractSections = function (description) {
  description = timestampify(description)
  
  let lines = description.split('\n')
  let output = []
  lines.forEach(line => {
    if (!line.startsWith('<a data-time="') || line.indexOf('" class="timestamp-link">') === -1) {
      return false
    }
    
    let parts = line.split('>')
    
    let timestamp = parts[1]
    timestamp = timestamp.slice(0, timestamp.indexOf('</'))
    //console.log(time)
    //time = Number(time)
    
    let timeParts = timestamp.split(':')
    let second = Number(timeParts[0]) * 60 + Number(timeParts[1])
    
    let header = parts[2].trim()
    
    output.push({
      timestamp,
      start: second,
      header
    })
  })
  
  return output
}

module.exports = xUBExtractSections