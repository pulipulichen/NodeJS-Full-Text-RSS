const GetFirstLine = require('./../../../api/lib/stringUtils/GetFirstLine.js')
const linkifyHtml = require('linkify-html')

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

const trimBR = function (item) {
  let description = item.find('description').text().trim()
  
  let descriptionModified = false
  while (description.startsWith('<br>')) {
    description = description.slice(4).trim()
    descriptionModified = true
  }
  while (description.endsWith('<br>')) {
    description = description.slice(0, -4).trim()
    descriptionModified = true
  }
  
  //console.log(descriptionModified)
  if (descriptionModified) {
    item.find('description').text(description)
  }
}

const replaceTitleWithDesription = function (item) {
  let title = item.find('title').text().trim()
  
  //console.log(i, 'xFBTitle', 1, title)
  let description = item.find('description').text().trim()
  if (description !== '') {
    if ( (title.startsWith('Photos from ') && title.endsWith(`'s post`))
            // || (title.endsWith(`'s cover photo`)) 
            ) {
      title = description
    }
  }
  
  //console.log(i, 'xFBTitle', 2, title)
  
  title = GetFirstLine(title)
  //console.log(title, description.slice(0, 30))
  if (description.startsWith(title)) {
    description = description.slice(title.length).trim()
    
    item.find('description').text(description)
  }
  
  title = title.replace(/#/ig, '')

  title = '[P]' + title
  
  item.find('title').text(title)
  
  TransformDescriptionLink(description, item)
}

const TransformDescriptionLink = function (description, item) {
  let linkifyDescription = linkifyHtml(description) 
  //console.log(linkifyDescription)
  if (description !== linkifyDescription) {
    item.find('description').text(linkifyDescription)
  }
}

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
  trimBR(item)
  
  // ------------------------------
  wrapCDATA(item)
  
  removeTitleBracket(item)
  
  //console.log(i, title)
}

module.exports = xFBPost