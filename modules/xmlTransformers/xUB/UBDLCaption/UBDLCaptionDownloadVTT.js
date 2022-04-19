const UBDLCaptionPreferLang = require('./UBDLCaptionPreferLang.js')

const { exec } = require("child_process")
const fs = require("fs")

const NodeCacheSQLite = require('./../../../../api/lib/cache/node-cache-sqlite.js')

let downloadLock = false

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function (videoID) {
  let lang = await UBDLCaptionPreferLang(videoID)
  if (lang === false) {
    return ''
  }
 
  if (downloadLock === true) {
    setTimeout(() => {
      downloadLock = false
    }, 3 * 60 * 1000)
  }

  while (downloadLock === true) {
    await sleep(10000)
  }

  return await NodeCacheSQLite.get('UBDLCaptionDownloadVTT', (videoID), () => {
    console.log('鎖定下載', videoID)
    downloadLock = true

    let oPath = '/tmp/ubdl/' + videoID
    let targetPath = '/tmp/ubdl/' + videoID + '.' + lang + '.vtt'

    let cmd = 'yo' + 'utu' + 'be-dl --write-sub --sub-lang ' + lang + ' --skip-download -o "' + oPath + '" https://www.yo' + 'utu' + 'be.com/watch?v=' + videoID
    console.log(cmd)
    return new Promise((resolve, reject) => {
      exec(cmd, (err, stdout, stderr) => {
        console.log('解除鎖定下載', videoID)
        downloadLock = false
        if (fs.existsSync(targetPath)) {
          fs.readFile(targetPath, 'utf8', function(err, data) {
            fs.unlinkSync(targetPath)
            if (err) {
              //throw err;
              return reject(err)
            }
            //console.log(data);
            return resolve(data.trim())
          })
        }
        else {
          console.error('Download failed: ' + videoID)
          return resolve('')
        }
      })
    })
  })
}