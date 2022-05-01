let appendText = '++'

const removeAppendText = function (title) {
  let text = title.text().trim()

  //if (text.endsWith(appendText)) {
  //  text = text.slice(0, -2)
  //}
  let pos = text.indexOf(appendText)
  if (pos > -1) {
    text = text.slice(0, pos).trim()
  }

  return text
} 

const FeedChannelTitle = function ($) {
  let title = $('channel > title:first')
  if (title.length === 1) {
    return removeAppendText(title)
  }
  
  title = $('feed > title:first')
  if (title.length === 1) {
    return removeAppendText(title)
  }
  
  //console.log($.html())
  //throw Error('Title is not found')
  console.error('Title is not found')
  return 'No title'
}

module.exports = FeedChannelTitle