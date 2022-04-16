const UBDLCaptionDownloadVTT = require('./UBDLCaptionDownloadVTT.js')
const NodeCacheSQLite = require('./../../../../api/lib/cache/node-cache-sqlite.js')

const convertSRTToCaptions = function (srtContent) {
  let captions = []
  
  let lines = srtContent.trim().split('\n')
  let info = {}
  let nextIsText = false
  
  //console.log(`lines.length`, lines.length)
  let lastEnd
    
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim()
    
    if (line === '') {
      continue
    }
    
    if (line.indexOf(' --> ') > -1) {
      nextIsText = true
      
      let parts = line.split(' --> ')
      let startSecond = timemarkToSecond(parts[0])
      let endSecond = timemarkToSecond(parts[1])
      
      info.start = startSecond
      info.end = endSecond
      info.dur = endSecond - startSecond
      
      if (lastEnd) {
        info.interval = info.start - lastEnd
        if (i > 0) {
          let prevCaption = captions[(captions.length - 1)]
          prevCaption.nextInterval = info.interval
        }
      }
      else {
        info.interval = 0
      }
      lastEnd = info.end
      
      continue
    }
    
    if (nextIsText) {
      
      info.text = line
      captions.push(info)
      info = {}
      
      nextIsText = false
    }
    
  }
  
  //console.log(captions[0])
  
  return captions
}

const timemarkToSecond = function (timemark) {
  // 00:01:56,452
  
  let parts1 = timemark.trim().split(':')
  
  let hour = Number(parts1[0])
  let minute = Number(parts1[1])
  let secondParts = parts1[2].split('.')
  
  let second = Number(secondParts[0])
  let pointSecond = Number(secondParts[1])
  
 
  second = second + (hour * 60 * 60)
  second = second + (minute * 60)
  second = second + (pointSecond / 1000)
  
  return second
}


module.exports = async function (videoID) {
  if (await NodeCacheSQLite.get('UBDLCaptionDownloadVTT', (videoID + ',' + lang)) === false) {
    // 尚未取得快取

    // 後臺慢慢下載
    await UBDLCaptionDownloadVTT(videoID)
    console.log('[UBDL] 放到後臺慢慢下載', videoID)
    return false
  }
  
  let vtt = await UBDLCaptionDownloadVTT(videoID)

  if (vtt === false) {
    return ''
  }
 
  return convertSRTToCaptions(vtt)
}