/**
 * title strip by hyper
 * @param {type} title
 * @returns {undefined}
 */
module.exports = async function (title) {
  if (!title || typeof(title) !== 'string') {
    return title
  }
  
  //console.log(typeof(title))
  if (title.startsWith('每日一博 |')
          || title.startsWith('Gitee 推荐 |')
          || title.startsWith('云原生周报 |')) {
    // 
    title = title.slice(title.indexOf('|')+1).trim()
  }
  if (title.startsWith('云栖发布｜')
          || title.startsWith('开源公告｜')) {
    title = title.slice(title.indexOf('｜')+1).trim()
  }
  if (title.startsWith('龙蜥社区一周动态：')
          || title.startsWith('云原生爱好者周刊：')
          || title.startsWith('淘系前端架构周刊：')
          || title.startsWith('最新研究指出：')
          || title.startsWith('CNCF Weekly：')) {
    
    title = title.slice(title.indexOf('：')+1).trim()
  }
  if (title.startsWith('【安全通告】')) {
    title = title.slice(title.indexOf('】')+1).trim()
  }
//  if (title.startsWith('云栖发布｜')) {
//    title = title.slice(title.indexOf('｜')+1).trim()
//  }
  return title
}