const fScaryplayTTV = function ({item, channel}) {
  let title = item.find('title').text().trim()
  
  return (!title.endsWith('希治閣Podcast')
          && !title.startsWith('突然直播')
          && !title.startsWith('【特別推介】')
          && (title.indexOf('八卦新聞') > -1 || title.indexOf('情報科') > -1 ))
}

module.exports = fScaryplayTTV