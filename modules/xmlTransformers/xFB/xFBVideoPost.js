
const shortenTitle = require('./shortenTitle.js')
const removeHash = require('./removeHash.js')

const decode = require('html-entities').decode


const xFBVideoPost = function (item) {

  let title = item.find('title:first').text().trim()
  title = shortenTitle(title)

  let description = item.find('description:first').text().trim()
  //console.log(title, description.slice(0, 30))
  if (description.startsWith(title)) {
    description = description.slice(title.length).trim()

    while (description.startsWith('<br>')) {
      description = description.slice(4).trim()
    }

    while (description.endsWith('<br>')) {
      description = description.slice(0, -4).trim()
    }

    description = decode(description)
    description = '<![CDATA[' + description + ']]>'

    //console.log(title, '-', description.slice(0, 30))
    //console.log(description)

    item.find('description:first').text(description)
  }

  title = removeHash(title)

  title = '[V]' + title
  item.find('title:first').text(title)

}

module.exports = xFBVideoPost