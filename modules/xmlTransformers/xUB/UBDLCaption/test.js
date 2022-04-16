const UBDLCaptionDownloadVTT = require('./UBDLCaptionDownloadVTT.js')

setTimeout(async () => {
  try {
    let content = await UBDLCaptionDownloadVTT('05AScdIS2lk')
    console.log(content)
  }
  catch (e) {
    console.error(e)
  }
}, 0)