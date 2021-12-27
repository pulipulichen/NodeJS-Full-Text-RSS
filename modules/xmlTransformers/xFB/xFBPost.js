const GetFirstLine = require('./../../../api/lib/stringUtils/GetFirstLine.js')
const linkifyHtml = require('linkify-html')
//const DesafeImg = require('./../../../api/full-text-parser/parsers/contentModifiers/DesafeImg.js')
const cheerio = require('cheerio')

const wrapCDATA = function (item) {
  let descriptionModified = false
  
  description = item.find('description').text().trim()
  if (description.indexOf('<br>') === -1) {
    return false
  }
  
  if (!description.startsWith('<![CDATA[')) {
    description = '<![CDATA[' + description
    descriptionModified = true
  }
  if (!description.endsWith(']]>')) {
    description = description + ']]>'
    descriptionModified = true
  }
  
  if (descriptionModified) {
    item.find('description').text(description)
  }
}

const DesafeImg = require('./xFBDesafeImg')

const trimBR = async function (item) {
  let description = item.find('description').text().trim()
  let originalDescription = description
  //let descriptionModified = false
  while (description.startsWith('<br>')) {
    description = description.slice(4).trim()
    //descriptionModified = true
  }
  while (description.endsWith('<br>')) {
    description = description.slice(0, -4).trim()
    //descriptionModified = true
  }
  
  description = await DesafeImg(description)
  
  //console.log(descriptionModified)
  if (originalDescription !== description) {
    item.find('description').text(description)
  }
}

const replaceTitleWithDesription = require('./replaceTitleWithDesription.js')

const bracketList = [
  ['【', '】']
]
const removeTitleBracket = function (item) {
  let title = item.find('title').text().trim()
  
  let changed = false
  bracketList.forEach(pair => {
    let posL = title.indexOf(pair[0])
    let posR = title.indexOf(pair[1])
    if (posL > -1 
            && posR > -1
            && posL < posR) {
      title = title.split(pair[0]).join('')
      title = title.split(pair[1]).join('')
      title = title.trim()
      changed = true
    }
  })
  
  if (changed) {
    item.find('title').text(title)
  }
}

const xFBPost = async function (item, i) {
  replaceTitleWithDesription(item)
  
  // ----------------------------
  await trimBR(item)
  
  // ------------------------------
  wrapCDATA(item)
  
  removeTitleBracket(item)
  
  //console.log(i, title)
}

module.exports = xFBPost