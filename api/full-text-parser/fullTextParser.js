const nodeCache = require('./../lib/cache/node-cache-sqlite.js')
const htmlLoader = require('./html-loader/htmlLoader.js')
const htmlTitleParser = require('./parsers/htmlTitleParser.js')
const htmlContentParser = require('./parsers/htmlContentParser.js')

const fullTextParser = async function (url, modules) {
  let html = await htmlLoader(url)
  
  let title = await htmlTitleParser(html, modules)
  let content = await htmlContentParser(html, modules)
  
  return {
    title,
    content
  }
}

module.exports = fullTextParser