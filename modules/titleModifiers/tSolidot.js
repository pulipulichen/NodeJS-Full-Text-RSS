const hyperList = [
  ' | ' // https://www.solidot.org/story?sid=69094
]

const removeStarts = require('./../../api/lib/stringUtils/removeStarts.js')

/**
 * title strip by hyper
 * @param {type} title
 * @returns {undefined}
 */
module.exports = async function (title) {
  return removeStarts(title, hyperList)
}