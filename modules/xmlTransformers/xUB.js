const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const FeedItemGetLink = require('./../../api/lib/xmlTransformers/FeedItemGetLink.js')
const FeedItemGetContent = require('./../../api/lib/xmlTransformers/FeedItemGetContent.js')
const FeedItemGetTitle = require('./../../api/lib/xmlTransformers/FeedItemGetTitle.js')
const FeedItemSetContent = require('./../../api/lib/xmlTransformers/FeedItemSetContent.js')

const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const fullTextParser = require('./../../api/full-text-parser/fullTextParser.js')

const GetJSON = require('./../../api/lib/HtmlLoader/GetJSON.js')

const UBVideoIDParser = require('./xUB/UBVideoIDParser.js')
const xUBGetCaptions = require('./xUB/xUBGetCaptions.js')
const xUBFormatDescription = require('./xUB/xUBFormatDescription.js')
const xUBExtractSections = require('./xUB/xUBExtractSections.js')
const xUBGroupCaptionsToSections = require('./xUB/xUBGroupCaptionsToSections.js')
const xUBBuildCaptionArticle = require('./xUB/xUBBuildCaptionArticle.js')
const xUBBuildSectionTOC = require('./xUB/xUBBuildSectionTOC.js')
const xUBBuildSectionFromCaptions = require('./xUB/xUBBuildSectionFromCaptions.js')

const DesafeImg = require('./../../api/full-text-parser/parsers/contentModifiers/DesafeImg.js')


//const newHeaderInterval = 0.5
//const newParagraphInterval = 0.3


const xUB = async function ($, moduleCodesString) {
  console.log('xUB', moduleCodesString)
  await FeedItemEach($, async (item, i) => {
    //console.log(i, item.find('title').text())
    //item.remove()
    
    //let link = FeedItemGetLink(item)
    //let {content} = await fullTextParser(link, moduleCodesString)
    //let title = item.find('title').text().trim()
    let content = FeedItemGetContent(item)
    content = DesafeImg(content)
    //console.log('content', content)
    let link = FeedItemGetLink(item)
    let videoID = UBVideoIDParser(link)
    
    let formattedContent = xUBFormatDescription(videoID, content)
    //console.log(formattedContent)
    //throw Error('todo')
    
    let sections = xUBExtractSections(content)
    //console.log(sections)
    
    let captions = await xUBGetCaptions(videoID)
    let title = FeedItemGetTitle(item)
    
    if (!captions || captions.length === 0) {
      //return item.remove()
      content = buildThumbnails(videoID) + '<br /><hr /><br />' + formattedContent
    }
    else {
      content = setupContentWithCaption(formattedContent, sections, captions, videoID)
      
      title = 'C] ' + title
      item.find('title:first').text(title)
    }
    
    if (moduleCodesString.indexOf('fHasCaptions') > -1 && !title.startsWith('C] ')) {
      item.remove()
      return false
    }
    
    FeedItemSetContent(item, content)
    
//    let title = item.find('title').text()
//    let titleNew = await ModuleManager(title, moduleCodesString, 't')
//    if (title !== titleNew) {
//      item.find('title').text(titleNew)
//    }
//    console.log(moduleCodesString, titleNew)
  })
  
  return $
}

const setupContentWithCaption = function (formattedContent, sections, captions, videoID) {
  
    if (sections.length < 2) {
      let result = xUBBuildSectionFromCaptions(captions)
      sections = result.sections
      captions = result.captions
    }
    
    sections = xUBGroupCaptionsToSections(sections, captions)
    
    
//    sections.forEach(s => {
//      console.log(s.header, '[' + s.captions.length + ']\t', s.captions.map(c => c.text).join(' '))
//    })
    let captionArticle = xUBBuildCaptionArticle(sections, videoID)
    
    let sectionsTOC = xUBBuildSectionTOC(sections, videoID)
    
    content = [buildThumbnails(videoID)]
    if (sectionsTOC) {
      content.push(sectionsTOC)
      content.push('<hr />')
    }
    if (captionArticle !== '') {
      content.push(captionArticle)
      content.push('<hr />')
    }
    if (formattedContent !== '') {
      content.push(formattedContent)
    }
    content = content.join('\n')
    
    return content
}

const buildThumbnails = function (videoID) {
  
    let thumbnails = `<p>
  <img src="http://i3.ytimg.com/vi/${videoID}/maxresdefault.jpg" style="max-width:100%;height: auto;" />
</p>
<p>
  <img src="https://img.youtube.com/vi/${videoID}/1.jpg" style="max-width:100%;height: auto;" />
  <img src="https://img.youtube.com/vi/${videoID}/2.jpg" style="max-width:100%;height: auto;" />
  <img src="https://img.youtube.com/vi/${videoID}/3.jpg" style="max-width:100%;height: auto;" />
</p>`
    
  return thumbnails
}

module.exports = xUB