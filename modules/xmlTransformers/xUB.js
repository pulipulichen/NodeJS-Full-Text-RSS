const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const FeedItemGetLink = require('./../../api/lib/xmlTransformers/FeedItemGetLink.js')
const FeedItemGetContent = require('./../../api/lib/xmlTransformers/FeedItemGetContent.js')
const FeedItemSetContent = require('./../../api/lib/xmlTransformers/FeedItemSetContent.js')

const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')

const GetJSON = require('./../../api/lib/HtmlLoader/GetJSON.js')

const xUBGetCaptions = require('./xUB/xUBGetCaptions.js')
const xUBFormatDescription = require('./xUB/xUBFormatDescription.js')
const xUBExtractSections = require('./xUB/xUBExtractSections.js')
const UBVideoIDParser = require('./xUB/UBVideoIDParser.js')


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

//const newHeaderInterval = 0.5
//const newParagraphInterval = 0.3

const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

function median(values){
  if(values.length ===0) throw new Error("No inputs");

  values.sort(function(a,b){
    return a-b;
  });

  var half = Math.floor(values.length / 2);
  
  if (values.length % 2)
    return values[half];
  
  return (values[half - 1] + values[half]) / 2.0;
}

const xUB = async function ($, moduleCodesString) {
  
  await FeedItemEach($, async (item, i) => {
    //console.log(i, item.find('title').text())
    //item.remove()
    
    //let link = FeedItemGetLink(item)
    //let {content} = await fullTextParser(link, moduleCodesString)
    //let title = item.find('title').text().trim()
    let content = FeedItemGetContent(item)
    //console.log('content', content)
    let link = FeedItemGetLink(item)
    let videoID = UBVideoIDParser(link)
    
    let formattedContent = xUBFormatDescription(videoID, content)
    //console.log(formattedContent)
    //throw Error('todo')
    
    let sections = xUBExtractSections(content)
    let captions = await xUBGetCaptions(videoID)
    
    let captionArticle = xUBBuildCaptionArticle(sections, captions)
    
    
    //console.log(link)
    
    let lines = []
    let sentences = ''
    let lastEndTime
    let thumbnails = `<p>
  <img src="http://i3.ytimg.com/vi/${videoID}/maxresdefault.jpg" style="max-width:100%;height: auto;" />
</p>
<p>
  <img src="https://img.youtube.com/vi/${videoID}/1.jpg" style="max-width:100%;height: auto;" />
  <img src="https://img.youtube.com/vi/${videoID}/2.jpg" style="max-width:100%;height: auto;" />
  <img src="https://img.youtube.com/vi/${videoID}/3.jpg" style="max-width:100%;height: auto;" />
</p>`
    
    //console.log(captionsLines.length)
    
    let intervals = []
    for (let j = 0; j < captionsLines.length; j++) {
      let $text = captionsLines[j]
      if (j > 0) {
        let currentStart = Number($text.attr('start'))
        intervals.push(currentStart - lastEndTime)
      }
      lastEndTime = Number($text.attr('start')) + Number($text.attr('dur'))
    }
    
    let base = median(intervals)
    //console.log(avg)
    if (base < 0.02) {
      base = 0.02
    }
    
    let newHeaderInterval = base * 20
    let newParagraphInterval = base * 10
    
    for (let j = 0; j < captionsLines.length; j++) {
      let $text = captionsLines.eq(j)
      
      if (j === 0) {
        lines.push(`<h2><a href="https://yo` + `utu.be/${videoID}?t=0" target="_blank">` + $text.text() + '</a></h2>')
        lastEndTime = Number($text.attr('start')) + Number($text.attr('dur'))
      }
      else {
        let currentStart = Number($text.attr('start'))
        let hasNewLine = false
        //console.log((currentStart - lastEndTime), $text.text())
        if ((currentStart - lastEndTime) > newHeaderInterval
                || $text.text().startsWith('【')) {
          //lines.push('')
          hasNewLine = true
        } 
        
        if (hasNewLine === false) {
          //lines.push('<p>' + $text.text() + '</p>')
          //sentences.push($text.text())
          if (sentences === '') {
            sentences = $text.text()
          }
          else if ((currentStart - lastEndTime) < 0.005) {
            sentences = appendPuncToSentence(sentences, '，') + $text.text()
          }
          else {
            sentences = appendPuncToSentence(sentences, '。') + $text.text()
          }
          
          let minInterval = newParagraphInterval - (sentences.length * 0.001)
          if (minInterval < 0) {
            minInterval = 0
          }
          if ((currentStart - lastEndTime) >= minInterval) {
            lines.push('<p>' + appendPuncToSentence(sentences, '。') + '</p>')
            sentences = ''
          }
        }
        else {
          if (sentences.length > 0) {
            lines.push('<p>' + appendPuncToSentence(sentences, '。') + '</p>')
            sentences = ''
          }
          
          let sec = Math.floor(currentStart)
          lines.push(`<h2><a href="https://yo` + `utu.be/${videoID}?t=${sec}" target="_blank">` + $text.text() + '</a></h2>')
        }
        lastEndTime = Number($text.attr('start')) + Number($text.attr('dur'))
      }
    }
    
    if (sentences.length > 0) {
      lines.push('<p>' + appendPuncToSentence(sentences, '。') + '</p>')
    }
    
    //console.log(lines.length)
    
    if (content && content !== '' && lines.length > 0) {
      //if (i === 0) {
      //  console.log(timestampify(content))
      //}
      
      
      //console.log(linkifyHTMLContent)
      
      content = `${thumbnails}${linkifyHTMLContent}\n<hr />\n${lines.join('\n')}`
      //console.log(1, content)
      FeedItemSetContent(item, content)
    }
    else if (lines.length > 0) {
      content = lines.join('\n')
      //console.log(2, content)
      FeedItemSetContent(item, content)
    }
    
    // FeedItemSetContent(item, content)
  })
  
  return $
}

module.exports = xUB