let appendText = '++'

const removeAppendText = function (title) {
  let text = title.text().trim()
  if (text.endsWith(appendText)) {
    text = text.slice(0, -2)
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
  
  console.log($.html())
  throw Error('Title is not found')
}

module.exports = FeedChannelTitle