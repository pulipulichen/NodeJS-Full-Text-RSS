const GetFirstLine = require('./../../../api/lib/stringUtils/GetFirstLine.js')

const shortenTitle = function (title, description) {
  
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
  
  return title
}

module.exports = shortenTitle