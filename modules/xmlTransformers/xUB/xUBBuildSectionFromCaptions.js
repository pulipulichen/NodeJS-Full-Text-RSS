const xUBCalcBaseInterval = require('./xUBCalcBaseInterval.js')

const xUBBuildSectionFromCaptions = function (captions) {
  
  let newHeaderInterval = xUBCalcBaseInterval(captions) * 10
  if (newHeaderInterval < 0.03) {
    newHeaderInterval = 0.03
  }
  
  let sections = []
  let newCaptions = []
  
  for (let i = 0; i < captions.length; i++) {
    let caption = captions[i]
    if (caption.interval >= newHeaderInterval) {
      sections.push({
        header: caption.text,
        start: caption.start
      })
    }
    else {
      newCaptions.push(caption)
    }
  }
  
  console.log(sections)
  
  return {
    sections,
    captions: newCaptions
  }
}

module.exports = xUBBuildSectionFromCaptions