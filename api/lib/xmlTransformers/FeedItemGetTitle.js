//const decode = require('html-entities').decode

const FeedItemGetTitle = function (item) {
  let title = item.find('title:first').text()
  return title
}

module.exports = FeedItemGetTitle