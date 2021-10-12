const tPTT = function (title) {
  // [心得] 第九季R24心得   - 看板 PokemonGO - 批踢踢實業坊
  // [心得] 第九季R24心得
  
  let pos = title.lastIndexOf(' - ')
  if (pos > -1) {
    title = title.slice(0, pos).trim()
  }
  
  pos = title.lastIndexOf(' - ')
  if (pos > -1) {
    title = title.slice(0, pos).trim()
  }
  
  return title
}

module.exports = tPTT