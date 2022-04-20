const cheerio = require('cheerio')

const cNCCUMailGatesNotification = function (content) {
  const $ = cheerio.load(content)
  const collection = $('table table table tr')

  console.log(collection.length)
  let items = []
  for (let i = 0; i < collection.length; i++) {
    let item = collection.eq(i)
    let sender = item.children("td:eq(2)").text().trim()
    let title = item.children("td:eq(3)").text().trim()
    let date = item.children("td:eq(4)").text().trim()

    items.push({
      sender: sender,
      title: title,
      date: date
    })
  }

  if (items.length === 0) {
    return '(No data)'
  }
  
  let itemsLi = items.map(item => {
    return `<li><b>${item.sender}</b>: <br /> <u>${item.title}</u> <br />(${item.date})</li>`
  })

  content = `<ul>${itemsLi.join('\n')}</ul>`
  return content
}

module.exports = cNCCUMailGatesNotification