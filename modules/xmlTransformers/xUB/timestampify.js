
function timestampify(text) {
  if (typeof(text) === 'function' && (typeof(text.html) === 'function')) {
    text = text.html()
  }
  //console.log(text.html())
  if (!text || typeof(text) !== 'string') {
    return ''
  } 
  text = text.replace(/^[0-5]?\d(?::[0-5]?\d){1,2}/gm, '<a data-time="$&" class="timestamp-link">$&</a>')
  //console.log(text)
  return text
}

module.exports = timestampify