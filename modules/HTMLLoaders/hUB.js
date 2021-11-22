const xUBGetCaptions = require('./../xmlTransformers/xUB/xUBGetCaptions.js')
//const PuppeterHTMLLoader = require('./../../api/lib/HtmlLoader/PuppeterHTMLLoader.js')

const hUB = async function (url, modules) {
  //console.log('hUB', url)
  let html = await xUBGetCaptions(url)
  
  return false
}

module.exports = hUB