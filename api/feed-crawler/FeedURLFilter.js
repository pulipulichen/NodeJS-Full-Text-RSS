const FeedURLFilter = function (url) {
  // feedURL: 'https://www.youtube.com/channel/UCiWXd0nmBjlKROwzMyPV-Nw',
  // https://www.youtube.com/feeds/videos.xml?channel_id=UCiWXd0nmBjlKROwzMyPV-Nw
  
  if (url.startsWith('https://www.youtube.com/channel/')) {
    let id = url.slice(url.lastIndexOf('/') + 1)
    url = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + id
  }
  
  return url
}

module.exports = FeedURLFilter

