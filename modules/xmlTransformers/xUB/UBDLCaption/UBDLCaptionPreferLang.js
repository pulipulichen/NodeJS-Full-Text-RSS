const UBDLCaptionListSubs = require('./UBDLCaptionListSubs.js')

const preferLang = [
  'Chinese Traditional',
  'zh-Hant',
  'zh-TW',
  'Chinese (Traditional)',
  'Chinese (Hong Kong)',
  'Chinese Hong Kong',
  '中国語 (香港)',
  '中国語 香港',
  'zh-HK',
  '中国語',
  'Chinese Simplified',
  'Chinese (Simplified)',
  'zh-Hant',
  'Chinese',
  'zh',
  'English',
  'en',
  'Japanese'
]

module.exports = async function (videoID) {
  let langs = await UBDLCaptionListSubs(videoID)

  if (langs.length === 0) {
    return false
  }

  for (let i = 0; i < preferLang.length; i++) {
    let lang = preferLang[i]

    if (langs.indexOf(lang) > -1) {
      return lang
    }
  }
  return langs[0]
}