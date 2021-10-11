const xFBIsVideo = function ($) {
  //console.log(html.indexOf('https://l.facebook.com/l.php'))
  let aList = $('a[href^="/watch/"]:first')
  return (aList.length > 0)
}

module.exports = xFBIsVideo