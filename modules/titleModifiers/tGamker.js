const tGamker = function (title) {
  // 最颯銀河一姐歸來！《密特羅德 生存恐懼》鑒賞【就知道玩遊戲153】
  // 最颯銀河一姐歸來！《密特羅德 生存恐懼》鑒賞【就知道玩遊戲153】
  
  let pos = title.lastIndexOf('【')
  if (pos > -1) {
    title = title.slice(0, pos).trim()
  }
  
  return title
}

module.exports = tGamker