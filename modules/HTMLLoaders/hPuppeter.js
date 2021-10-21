//const HtmlLoader = require('./../../api/lib/HtmlLoader/HtmlLoader.js')
const PuppeterHTMLLoader = require('./../../api/lib/HtmlLoader/PuppeterHTMLLoader.js')

const hDefault = async function (url, modules) {
  //console.log(url)
  let html = await PuppeterHTMLLoader(url)
  
  return html
}

module.exports = hDefault