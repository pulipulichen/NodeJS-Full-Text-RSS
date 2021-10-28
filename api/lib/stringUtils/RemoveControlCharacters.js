const RemoveControlCharacters = function (content) {
  content = content.replace(/[\u0000-\u0008\u000B\u001F\u007F-\u009F]/g, "")  
  return content
}

module.exports = RemoveControlCharacters