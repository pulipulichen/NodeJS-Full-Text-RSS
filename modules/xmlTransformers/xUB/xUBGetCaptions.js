
const captionCacheHour = 24
const captionCacheTime = captionCacheHour * 60 * 60 * 1000

const cheerio = require('cheerio')

const preferCode = [
  'zh-Hant',
  'zh-HK',
  'zh-Hans',
]

const HtmlLoader = require('./../../../api/lib/HtmlLoader/HtmlLoader.js')

const xUBGetCaptions = async function (videoID) {


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


  // --------------------------


  //console.log(queryCode, langCodeList)

  //console.log(queryCode)

  if (!queryCode) {
    //item.remove()
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
  let captions = []
  
  let lastEnd
  for (let i = 0; i < captionsLines.length; i++) {
    let line = captionsLines.eq(i)
    let info = {
      text: line.text(),
      start: Number(line.attr('start')),
      dur: Number(line.attr('dur'))
    }
    
    let end = info.start + info.dur
    let interval
    if (!lastEnd) {
      interval = 0
    }
    else {
      interval = info.start - lastEnd
    }
    
    lastEnd = end
    
    info.end = end
    info.interval = interval
    captions.push(info)
  }
  
  return captions
}

module.exports = xUBGetCaptions