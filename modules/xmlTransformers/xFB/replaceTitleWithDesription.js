const GetFirstLine = require('./../../../api/lib/stringUtils/GetFirstLine.js')
const linkifyHtml = require('linkify-html')

const TransformDescriptionLink = function (description, item) {
  let linkifyDescription = linkifyHtml(description) 
  //console.log(linkifyDescription)
  if (description !== linkifyDescription) {
    item.find('description').text(linkifyDescription)
  }
}

const replaceTitleWithDesription = function (item) {
  let title = item.find('title').text().trim()
  
  //console.log(i, 'xFBTitle', 1, title)
  let description = item.find('description').text().trim()
  //console.log(title)
  if (description !== '') {
    if ( (title.startsWith('Photos from ') && title.endsWith(`'s post`))
             || (title === 'Timeline Photos')
             || title.endsWith('.mp4')
            ) {
      title = description
    }
  }
  
  //console.log(i, 'xFBTitle', 2, title)
  
  title = GetFirstLine(title)
  
  if (title.length > 40) {
    if (title.indexOf('。') > 20) {
      title = title.slice(0, title.indexOf('。') + 1).trim()
    }
    else if (title.indexOf('！') > 20) {
      title = title.slice(0, title.indexOf('！') + 1).trim()
    }
    else if (title.indexOf('...') > 20) {
      title = title.slice(0, title.indexOf('...') + 3).trim()
    }
    else if (title.indexOf('，', 20) > 20) {
      title = title.slice(0, title.indexOf('，', 20) + 1).trim()
    }
  }
  
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

module.exports = replaceTitleWithDesription