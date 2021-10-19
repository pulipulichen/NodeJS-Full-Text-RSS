const FeedFeedGeneratorURI = function ($) {
  //console.log($.html())
  let element = $('generator[uri]:first')
  if (element.length === 1) {
    return element.attr('uri')
  }
  return false
}

module.exports = FeedFeedGeneratorURI