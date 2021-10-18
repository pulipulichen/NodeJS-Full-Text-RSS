const xUBCalcBaseInterval = require('./xUBCalcBaseInterval.js')

const xUBBuildSectionFromCaptions = function (captions) {
  
  let newHeaderInterval = xUBCalcBaseInterval(captions)
  if (newHeaderInterval < 0.1) {
    newHeaderInterval = 0.1
  }
  newHeaderInterval = newHeaderInterval * 5
  
  //console.log(newHeaderInterval)
  
  let sections = []
  let newCaptions = []
  
  for (let i = 0; i < captions.length; i++) {
    let caption = captions[i]
    console.log(i, caption.interval, caption.text)
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
  
  //console.log(sections)
  
  if (sections.length > 10) {
    console.log('newHeaderInterval', newHeaderInterval)
    //throw Error('Too many sections')
  }
  
  return {
    sections,
    captions: newCaptions
  }
}

module.exports = xUBBuildSectionFromCaptions