
let needle = `
<span class="f2">※ 發信站: 批踢踢實業坊(ptt.cc), 來自: `

function chineseCount(word){
  return word.split(/[\u4e00-\u9a05]/).length -1;
}

function lineCount(word) {
  let chineseLength = chineseCount(word)
  let otherLength = word.length - chineseLength
  return chineseLength * 2 + otherLength
}

const cPTTMergeLines = function ($) {
  
  let content = $('body > div').html()
  if (!content) {
    return ''
  }
  content = content.trim()
  
  // --------------
  // add <br />
  
  let pos = content.indexOf(needle)
  if (pos > -1) {
    let article = content.slice(0, pos)
    
    // try to merge lines
    let lines = article.split('\n')
    let outputLines = []
    lines.forEach((line, i) => {
      line = line.trim()
      //console.log(line.length)
      
//      if (i > 0) {
//        console.log(lineCount(lines[i - 1].trim()))
//      }
      
      if (i > 0 && lineCount(lines[i - 1].trim()) > 73) {
        //console.log(line.length, lines[i - 1].trim().length, line)
        
        let lastLine = outputLines[outputLines.length - 1]
        lastLine = lastLine + line
        outputLines[outputLines.length - 1] = lastLine
        return true
      }
     
      outputLines.push(line)
    })
    
    article = outputLines.join('<br />\n')
    content = '<p>' + article + '</p>' + content.slice(pos)
  }
  
  return content
}

module.exports = cPTTMergeLines