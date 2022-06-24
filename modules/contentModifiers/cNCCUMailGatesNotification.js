const cheerio = require('cheerio')

var tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

function replaceTag(tag) {
  return tagsToReplace[tag] || tag;
}

function safe_tags_replace(str) {
  return str.replace(/[&<>]/g, replaceTag);
}

const cNCCUMailGatesNotification = function (content) {
  const $ = cheerio.load(content)
  const collection = $('table tbody table tbody table tbody > tr')

  //console.trace(collection.length)
  let items = []
  for (let i = 1; i < collection.length; i++) {
    
    let item = collection.eq(i)
    let sender = item.children("td:eq(2)").text().trim()
    let title = item.children("td:eq(3)").text().trim()
    let date = item.children("td:eq(4)").text().trim()

    if (sender === '' || 
        sender === '寄件人') {
      continue
    }

    items.push({
      sender: safe_tags_replace(sender),
      title: safe_tags_replace(title),
      date: date
    })
  }

  if (items.length === 0) {
    return '(No data)'
  }
  
  //console.log(items)

  let itemsLi = items.map(item => {
    return `<li><b>${item.sender}</b>: <br /> <u>${item.title}</u> <br />(${item.date})</li>`
  })

  content = `<ul>${itemsLi.join('\n')}</ul>`
  return content
}

module.exports = cNCCUMailGatesNotification