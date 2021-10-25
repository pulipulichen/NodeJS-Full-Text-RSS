const tTongliNewletter = function (title) {
  // 2021東立電子報-NO.41 《心神蕩漾的雙唇 more melty》心醉的續篇重磅登場！
  // 《心神蕩漾的雙唇 more melty》心醉的續篇重磅登場！
  
  title = title.trim()
  let pos = title.indexOf(' ')
  if (pos > -1) {
    title = title.slice(pos).trim()
  }
  
  return title
}

module.exports = tTongliNewletter