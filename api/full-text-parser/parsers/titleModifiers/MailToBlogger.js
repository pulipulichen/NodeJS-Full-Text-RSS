const mimeWordDecode = require('emailjs-mime-codec').mimeWordDecode

//let str = '=?UTF-8?Q?See_on_=C3=B5hin_test?='
//let str = '=?BIG-5?Q?=B2=C4=A4Q=A4=AD=B4=C1=AC=E3=B5o=B9q=A4l=B3=F8?='
//let str = '=?big5?Q?=B2=C4=A4Q=A4=AD=B4=C1=AC=E3=B5o=B9q=A4l=B3=F8?='
//let a = mimeWordDecode(str)
//console.log(a)
//a = iconv.decode(Buffer(a), "utf8")


const tMailToBlogger = function (title) {
  console.log(title)
  if (!title || typeof(title) !== 'string') {
    return title
  }
  
  // ------------------
  
  
  let oldBig5Pos = title.indexOf('=?BIG-5?Q?=')
  if (oldBig5Pos > -1
          && title.endsWith('?=')) {
    title = title.slice(0, oldBig5Pos) + '=?big5?Q?=' + title.slice(oldBig5Pos + 11)
  }
  
  // -----------------
  
  if (title.indexOf('=?') > -1
          && title.indexOf('?Q?=') > -1
          && title.endsWith('?=')) {
    let pos = title.indexOf('=?')
    let extractMimeWordCode = title.slice(pos)
    
    try {
      extractMimeWordCode = mimeWordDecode(extractMimeWordCode)
    }
    catch (e) {
      console.error(e)
    }
    
    title = title.slice(0, pos) + extractMimeWordCode
  }
  
  return title
}

module.exports = tMailToBlogger