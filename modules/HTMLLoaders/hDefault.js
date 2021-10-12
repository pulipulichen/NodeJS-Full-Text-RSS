const HtmlLoader = require('./../../api/lib/HtmlLoader/HtmlLoader.js')

const hDefault = async function (url, modules) {
  let html = await HtmlLoader(url)
  
  return html
}

module.exports = hDefault