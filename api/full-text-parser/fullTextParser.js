const nodeCache = require('./../lib/cache/node-cache-sqlite.js')
//const HtmlLoader = require('./../lib/HtmlLoader/HtmlLoader.js')
const htmlTitleParser = require('./parsers/htmlTitleParser.js')
const htmlContentParser = require('./parsers/htmlContentParser.js')

const DetectFeedModule = require('./DetectWebpageModule.js')

const ModuleManager = require('./../lib/ModuleManager/ModuleManager.js')
const IsURL = require('./../lib/stringUtils/IsURL.js')

const fullTextParser = async function (url, modules) {
  if (IsURL(url) === false) {
    console.error('Not a URL: ' + url)
    return {
      title: '',
      content: '',
    }
  }
  
  //console.log(modules)
  modules = DetectFeedModule(url, modules)
  
  //console.log(modules)
  
  //let html = await HtmlLoader(url)
  let html = await ModuleManager(url, modules, 'h')
  
//  if (url === 'https://www.eprice.com.tw/mobile/talk/4541/5682493/1/') {
//    console.log(html)
//  }
  
  if (html === '') {
    console.log('[fullTextParser]', 'SKIP', url)
    return {
      title: '',
      content: '',
    }
  }
  
  let title = await htmlTitleParser(html, modules)
  
  //console.log('html', html)
  
  let content = await htmlContentParser(html, modules, url)
  
  //console.log('content', content)
//  
//  if (url === 'https://www.eprice.com.tw/mobile/talk/4541/5682493/1/') {
//    console.log(content)
//  }
//  
  return {
    title,
    content
  }
}

module.exports = fullTextParser