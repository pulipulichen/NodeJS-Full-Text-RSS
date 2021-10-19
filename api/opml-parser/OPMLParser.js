/* global __dirname */

const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

const OPMLParser = async function () {
  let feedPath = path.resolve(__dirname, './feedly-c52706de-117c-4c58-b21d-75e935448738-2021-10-12.opml')
  //console.log(feedPath)
  let feedXML = fs.readFileSync(feedPath, 'utf8')
  //console.log(feedXML)
  const $ = cheerio.load(feedXML, {
    xmlMode: true,
    decodeEntities: false
  })
  
  let urlList = await parseAvailableURL($)
  
  return urlList
}

const parseAvailableURL = async function ($) {
  let urlList = []
  
  let outlineList = $('outline[xmlUrl]')
  for (let i = 0; i < outlineList.length; i++) {
    let outline = outlineList.eq(i)
    
    let title = outline.attr('title').trim()
    let url = outline.attr('xmlUrl')
    
    if (url.startsWith('http://exp-full-text-rss-2013.dlll.nccu.edu.tw/full-text-rss/makefulltextfeed.php?url=')) {
      url = url.slice(86).trim()
    }
    
    urlList.push({
      title,
      url
    })
  }
  
  return urlList
}

module.exports = OPMLParser