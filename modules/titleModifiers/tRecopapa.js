const tRecopapa = function (title) {
  // [心得] 第九季R24心得   - 看板 PokemonGO - 批踢踢實業坊
  // [心得] 第九季R24心得
  
  if (title.endsWith('每週遊戲新聞 趣聞 都在偷閒加油站')) {
    title = title.slice(0, -17).trim()
  }
  
  return title
}

module.exports = tRecopapa