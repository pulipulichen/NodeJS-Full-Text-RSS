const xUBBuildSectionTOC = function (sections, videoID) {
  if (!sections || sections.length < 2) {
    return ''
  }
  
  return '<ol>' + sections.map(section => {
    let start = Math.floor(section.start)
    return `<li><a href="https://yo` + `utu.be/${videoID}?t=${start}" target="_blank">${section.header}</a></li>`
  }).join('\n') + '</ol>'
}

module.exports = xUBBuildSectionTOC