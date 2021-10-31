let appendText = '++'

const setTitle = function (title) {
  let titleText = title.text().trim()
  title.text(titleText + appendText)
}

const FeedChannelAppendTitle = function ($) {
  let title = $('channel > title:first')
  if (title.length === 1) {
    return setTitle(title)
  }
  
  title = $('feed > title:first')
  if (title.length === 1) {
    return setTitle(title)
  }
  
  //console.log($.html())
  throw Error('Title is not found')
}

module.exports = FeedChannelAppendTitle