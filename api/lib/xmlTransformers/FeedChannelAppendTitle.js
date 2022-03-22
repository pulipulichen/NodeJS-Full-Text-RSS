let appendText = '++'

const GetModuleRandomToken = require('./../ModuleManager/GetModuleRandomToken.js')

const setTitle = function (title, randomToken = '') {
  let titleText = title.text().trim()

  if (titleText.indexOf(appendText) === -1) {
    title.text(titleText + appendText + randomToken)
  }
}

const FeedChannelAppendTitle = function ($, moduleCodesString = []) {
  let title = $('channel > title:first')
  let randomToken = GetModuleRandomToken(moduleCodesString)

  //let link = $('channel > link:first')
  //$('channel > link:first').text('https://buzzorange.com/techorange?test=0116-1456')

  if (title.length === 1) {
    return setTitle(title, randomToken)
  }
  
  title = $('feed > title:first')
  if (title.length === 1) {
    return setTitle(title, randomToken)
  }
  
  //console.log($.html())
  //throw Error('Title is not found')
  console.error('Title is not found')
  return false
}

module.exports = FeedChannelAppendTitle