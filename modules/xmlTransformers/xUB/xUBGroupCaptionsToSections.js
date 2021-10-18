

const xUBGroupCaptionsToSections = function (sections, captions) {
  if (sections.length < 1) {
    return [{
        header: captions[0].text,
        start: captions[0].start,
        captions: captions.splice(1)
    }]
  }
  
  // --------------
  
  let nextSectionTime
  if (sections.length > 1) {
    nextSectionTime = sections[1].start
  }
  else {
    nextSectionTime = captions[(captions.length - 1)].end + 1
  }
  
  //console.log('nextSectionTime', nextSectionTime)
  //console.log('sections', sections.length)
  
  // --------------
  
//  sections.forEach(s => {
//    console.log(s.start, s.header)
//  })
  //console.log('=============')
  
  let sectionIndex = 0
  let currentSection = []
  for (let i = 0; i < captions.length; i++) {
    let caption = captions[i]
    let start = caption.start
    let end = caption.end
    
    //console.log(i, sectionIndex, nextSectionTime, start, end, ((end-start)/2 + start), caption.text)
    
    if (i > 0 && start > nextSectionTime) {
      sections[sectionIndex].captions = currentSection

      sectionIndex++
      currentSection = []
      if (sectionIndex < sections.length - 1) {
        nextSectionTime = sections[(sectionIndex + 1)].start
      }
      else {
        nextSectionTime = captions[(captions.length - 1)].end + 1
      }
      
      currentSection.push(caption)
    }
    else if (i > 0 && ((end-start)/2 + start) > nextSectionTime) {
    //if (i > 0 && start > nextSectionTime) {
//      console.log(i, start, caption.text)
//      console.log(i, nextSectionTime, sections[sectionIndex].header, sections[sectionIndex].start)
//      console.log(i, currentSection.length, currentSection.map(c => c.text).join(' '))
//      
      //console.log(sectionIndex, start, nextSectionTime)
      
      //if (((end-start)/2 + start) < nextSectionTime) {
        currentSection.push(caption)
        //if (start > nextSectionTime) {
          sections[sectionIndex].captions = currentSection

          sectionIndex++
          currentSection = []
          if (sectionIndex < sections.length - 1) {
            nextSectionTime = sections[(sectionIndex + 1)].start
          }
          else {
            nextSectionTime = captions[(captions.length - 1)].end + 1
          }
        //}
      //}
    }
    else {
      currentSection.push(caption)
    }
  }
  
  if (currentSection.length > 0) {
    sections[sectionIndex].captions = currentSection
  }
  
//  sections.forEach(s => {
//    console.log(s.header, '[' + s.captions.length + ']\t', s.captions.map(c => c.text).join(' '))
//  })
  
  return sections
}

module.exports = xUBGroupCaptionsToSections