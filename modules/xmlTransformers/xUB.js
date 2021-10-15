const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const FeedItemGetLink = require('./../../api/lib/xmlTransformers/FeedItemGetLink.js')
const FeedItemGetContent = require('./../../api/lib/xmlTransformers/FeedItemGetContent.js')
const FeedItemSetContent = require('./../../api/lib/xmlTransformers/FeedItemSetContent.js')

const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')
const HtmlLoader = require('./../../api/lib/HtmlLoader/HtmlLoader.js')
const GetJSON = require('./../../api/lib/HtmlLoader/GetJSON.js')

const UBVideoIDParser = require('./xUB/UBVideoIDParser.js')

const captionCacheHour = 24
const captionCacheTime = captionCacheHour * 60 * 60 * 1000

const cheerio = require('cheerio')

const preferCode = [
  'zh-Hant',
  'zh-HK',
  'zh-Hans',
]

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

const xUB = async function ($, moduleCodesString) {
  
  await FeedItemEach($, async (item, i) => {
    //console.log(i, item.find('title').text())
    //item.remove()
    
    //let link = FeedItemGetLink(item)
    //let {content} = await fullTextParser(link, moduleCodesString)
    //let title = item.find('title').text().trim()
    let content = FeedItemGetContent(item)
    let link = FeedItemGetLink(item)
    let videoID = UBVideoIDParser(link)
    
    //console.log(link)
    
    // --------------------------
    
    let listURL = `https://video.google.com/timedtext?v=${videoID}&type=list`
    let listXML = await HtmlLoader(listURL, captionCacheTime)
    
    //console.log(listURL)
    
    const $list = cheerio.load(listXML, {
      xmlMode: true,
      decodeEntities: false
    })
    
    let langCodeList = []
    let tracks = $list('track[lang_code]')
    for (let i = 0; i < tracks.length; i++) {
      let code = tracks.eq(i).attr('lang_code')
      langCodeList.push(code)
    }
    
    let queryCode = langCodeList[0]
    for (let i = 0; i < preferCode.length; i++) {
      let code = preferCode[i]
      if (langCodeList.indexOf(code) > -1) {
        queryCode = code
        break
      }
    }
    
    //console.log(queryCode, langCodeList)
    
    //console.log(queryCode)
    
    if (!queryCode) {
      item.remove()
      return false
    }
    
    // --------------------------
    
    let captionURL = `https://video.google.com/timedtext?type=track&v=${videoID}&id=0&lang=${queryCode}`
    const captionXML = await HtmlLoader(captionURL)
    
    const $caption = cheerio.load(captionXML, {
      xmlMode: true,
      decodeEntities: false
    })
    
    //console.log(captionURL)
    //console.log(captionXML)
    
    let captionsLines = $caption('transcript > text')
    let lines = [
      `<p><img src="http://i3.ytimg.com/vi/${videoID}/maxresdefault.jpg" style="max-width:100%;height: auto;" /></p>`,
      //`<p><img src="https://img.youtube.com/vi/${videoID}/0.jpg" style="max-width:100%;height: auto;" /></p>`,
      `<p><img src="https://img.youtube.com/vi/${videoID}/1.jpg" style="max-width:100%;height: auto;" /><img src="https://img.youtube.com/vi/${videoID}/2.jpg" style="max-width:100%;height: auto;" /><img src="https://img.youtube.com/vi/${videoID}/3.jpg" style="max-width:100%;height: auto;" /></p>`,
    ]
    let sentences = ''
    let lastEndTime
    
    //console.log(captionsLines.length)
    
    let intervals = []
    for (let j = 0; j < captionsLines.length; j++) {
      let $text = captionsLines.eq(j)
      if (j > 0) {
        let currentStart = Number($text.attr('start'))
        intervals.push(currentStart - lastEndTime)
      }
      lastEndTime = Number($text.attr('start')) + Number($text.attr('dur'))
    }
    
    let avg = average(intervals)
    //console.log(avg)
    if (avg < 0.01) {
      avg = 0.01
    }
    
    let newHeaderInterval = avg * 3
    let newParagraphInterval = avg * 1.5
    
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
        if ((currentStart - lastEndTime) > newHeaderInterval) {
          //lines.push('')
          hasNewLine = true
        } 
        
        if (hasNewLine === false) {
          //lines.push('<p>' + $text.text() + '</p>')
          //sentences.push($text.text())
          if (sentences === '') {
            sentences = $text.text()
          }
          else if ((currentStart - lastEndTime) < 0.01) {
            sentences = appendPuncToSentence(sentences, '，') + $text.text()
          }
          else {
            sentences = appendPuncToSentence(sentences, '。') + $text.text()
          }
          
          let minInterval = newParagraphInterval - (sentences.length * 0.001)
          if (minInterval < 0.02) {
            minInterval = 0.02
          }
          if ((currentStart - lastEndTime) > minInterval) {
            lines.push('<p>' + sentences + '。</p>')
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
      content = `${content}\n<hr />\n${lines.join('\n')}`
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