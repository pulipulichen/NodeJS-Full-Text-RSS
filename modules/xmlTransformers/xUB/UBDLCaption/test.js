const UBDLCaptionDownloadVTT = require('./UBDLCaptionDownloadVTT.js')

setTimeout(async () => {
  let content = await UBDLCaptionDownloadVTT('05AScdIS2lk')
  console.log(content)
}, 0)