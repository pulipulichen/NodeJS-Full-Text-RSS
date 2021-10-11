const nodeCache = require('./../lib/cache/node-cache-sqlite.js')
const HtmlLoader = require('./../lib/HtmlLoader/HtmlLoader.js')
const htmlTitleParser = require('./parsers/htmlTitleParser.js')
const htmlContentParser = require('./parsers/htmlContentParser.js')

const fullTextParser = async function (url, modules) {
  let html = await HtmlLoader(url)
  
  let title = await htmlTitleParser(html, modules)
  let content = await htmlContentParser(html, modules)
  
  return {
    title,
    content
  }
}

module.exports = fullTextParser