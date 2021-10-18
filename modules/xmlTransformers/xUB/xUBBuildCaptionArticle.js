const appendPuncToSentence = function (sentence, punc) {
  if (sentence.endsWith('。')
          || sentence.endsWith('？')
          || sentence.endsWith('~')
          || sentence.endsWith('～')
          || sentence.endsWith('！')
          || sentence.endsWith('...')
          || sentence.endsWith('、')) {
    return sentence
  }
  else {
    return sentence + punc
  }
}


function median(values){
  if (values.length === 0) {
    return 0
  }

  values.sort(function(a,b){
    return a-b;
  });

  var half = Math.floor(values.length / 2);
  
  if (values.length % 2)
    return values[half];
  
  return (values[half - 1] + values[half]) / 2.0;
}

function getStandardDeviation (array) {
  if (array.length === 0) {
    return 0
  }
  
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

const buildCaptionParagraph = function (captions) {
  //console.log('buildCaptionParagraph', captions.length)
  if (captions.length === 1) {
    return [buildCaptionParagraphToArtcile(captions)]
  }
  
  let intervals = captions.map(c => c.nextInterval)
  intervals = intervals.splice(0, (intervals.length - 1))
  //console.log(captions.splice(0, (captions.length - 1)).length)
  //console.log(intervals.length)
  //console.log('buildCaptionParagraph C', captions.length)
  
  let med = median(intervals)
  let stdev = getStandardDeviation(intervals)
  let newParagraphInterval = med + stdev
  if (newParagraphInterval < 0.01) {
    newParagraphInterval = 0.01
  }
  
  let paragraphs = []
  let currentParagraph = []
  
  //console.log('buildCaptionParagraph B', captions.length)
  
  for (let i = 0; i < captions.length; i++) {
    let caption = captions[i]
    //console.log(i, caption.interval, newParagraphInterval, caption.text)
    if (i === 0) {
      currentParagraph.push(caption)
      //continue
    }
    else {
      let interval = caption.interval
      //console.log(interval, newParagraphInterval, caption.text)
      if (interval >= (newParagraphInterval - (currentParagraph.length * 0.001))) {
        paragraphs.push(buildCaptionParagraphToArtcile(currentParagraph))
        currentParagraph = []
      }
      
      currentParagraph.push(caption)
    }
  }
  
  if (currentParagraph.length > 0) {
    paragraphs.push(buildCaptionParagraphToArtcile(currentParagraph))
  }
  
  //console.log('buildCaptionParagraph', newParagraphInterval, paragraphs.length)
  
  return paragraphs
}

const buildCaptionParagraphToArtcile = function (captions) {
  return captions.map(c => {
    let text = c.text
    if (c.nextInterval > 0.01) {
      return appendPuncToSentence(text, '。')
    }
    else {
      return appendPuncToSentence(text, '，')
    }
  }).join('')
}

const mergeArticle = function (sections, videoID) {
  return sections.map(section => {
    let start = Math.floor(section.start)
    let header = `<h2><a href="https://yo` + `utu.be/${videoID}?t=${start}" target="_blank">${section.header}</a></h2>`
    
    return [
      header,
      section.paragraphs.map(p => `<p>${p}</p>`).join('\n')
    ].join('\n')
  }).join('\n')
}

const xUBBuildCaptionArticle = function (sections, videoID) {
  for (let i = 0; i < sections.length; i++) {
    let section = sections[i]
    let captions = section.captions
    
    sections[i].paragraphs = buildCaptionParagraph(captions)
    //console.log(section.header, captions.length, sections[i].paragraphs.length)
  }
  
  return mergeArticle(sections, videoID)
}

module.exports = xUBBuildCaptionArticle