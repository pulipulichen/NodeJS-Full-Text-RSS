module.exports = function (title) {
  if (!title) {
    return title
  }
  
  // 課堂學習的最佳Chromebook&#65306;ASUS Chromebook Detachable CZ1 / The Best&#160;Learning partner:&#160;ASUS Chromebook Detachable CZ1 - 布丁布丁吃什麼&#65311;
  //console.log(title)
  //console.log(title.charCodeAt(0))

  //let match = title.match(/\&#([^<]*);/) // regular expression to parse contents of the <title> tag
  //console.log(match)
  
  //'課堂學習的最佳Chromebook&#65306;ASUS <Chromebook> Detachable CZ1 / The Best&#160;Learning partner:&#160;ASUS <Chromebook> Detachable CZ1 - 布丁布丁吃什麼&#65311;'.replace(/(&#([\d]+);)/ig, (a) => '||')

  // 課堂學習的最佳Chromebook：ASUS Chromebook Detachable CZ1 / The Best Learning partner: ASUS Chromebook Detachable CZ1 - 布丁布丁吃什麼？

  return title.replace(/(&#([\d]+);)/ig, (code) => {
//    let pos = code.indexOf(';')
//    if (pos > -1) {
//      code = code.slice(0, pos + 1)
//    }
    let codeNumber = Number(code.slice(2, -1))
    //console.log(code, codeNumber)
    if (isNaN(codeNumber)) {
      return code
    }
    else {
      return String.fromCharCode(codeNumber)
    }
  })
}