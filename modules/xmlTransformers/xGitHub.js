const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const FeedItemGetLink = require('./../../api/lib/xmlTransformers/FeedItemGetLink.js')
const FeedItemGetContent = require('./../../api/lib/xmlTransformers/FeedItemGetContent.js')
const FeedItemSetContent = require('./../../api/lib/xmlTransformers/FeedItemSetContent.js')

const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')
const HtmlLoader = require('./../../api/lib/HtmlLoader/HtmlLoader.js')

let readmeCacheHour = 24
let readmeCacheTime = readmeCacheHour * 60 * 60 * 1000

const cheerio = require('cheerio')

const xGitHub = async function ($, moduleCodesString) {
  // 先想辦法取得README吧
  let repoLink = $('link[type="application/atom+xml"]:first').attr('href')
  if (repoLink.endsWith('/commits/master.atom')) {
    repoLink = repoLink.slice(0, -20).trim()
    //repoLink = repoLink.slice(0, repoLink.lastIndexOf('/'))
  }
  
  let repoHTML = await HtmlLoader(repoLink, readmeCacheTime)
  const $repo = cheerio.load(repoHTML)
  $repo('a.anchor[href^="#"]').remove()
  let readme = $repo('article.entry-content').html()
  
  await FeedItemEach($, async (item, i) => {
    //console.log(i, item.find('title').text())
    //item.remove()
    
    //let link = FeedItemGetLink(item)
    //let {content} = await fullTextParser(link, moduleCodesString)
    let title = item.find('title').text().trim()
    
    let content = FeedItemGetContent(item)
    
    const $content = cheerio.load(content)
    content = $content('pre').text().trim()
    //console.log(content, title)
    if (content.startsWith(title)) {
      content = content.slice(title.length).trim()
    }
    
    content = content.split('\n').join('<br />\n').trim()
    
    if (content !== '') {
      content = content + `<br /><hr />` + readme
    }
    else {
      content = readme
    }
    //console.log(i, content)
    FeedItemSetContent(item, content)
  })
  
  return $
}

module.exports = xGitHub