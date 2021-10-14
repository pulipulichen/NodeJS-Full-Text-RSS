const HtmlLoader = require('./../../api/lib/HtmlLoader/PuppeterHTMLLoader.js')
const xFBType = require('./../xmlTransformers/xFB/xFBType.js')

const hFB = async function (url) {
  if (url.startsWith('https://www.facebook.com/')) {
    url = 'https://m.facebook.com/' + url.slice(25)
  }
  
  let html = await HtmlLoader(url)
  
  // 需要判斷類型
  let type = await xFBType(html)
  console.log(type)
  //console.log(html)
  return html
}

module.exports = hFB