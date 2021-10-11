const hyperList = [
  ' | ',
  ' - ',
  ' — ' // dd[Node.js 爬蟲] 用 request + cheerio 抓取地震資訊 — 1010Code
]

const removeEnds = require('./../../api/lib/stringUtils/removeEnds.js')

/**
 * title strip by hyper
 * @param {type} title
 * @returns {undefined}
 */
module.exports = async function (title) {
  return removeEnds(title, hyperList)
}