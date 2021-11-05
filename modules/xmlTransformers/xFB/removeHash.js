const removeHash = function (title) {
  if (title.startsWith('#')) {
    title = title.slice(1)
  }
  
  title = title.split(' #').join(' ')
  
  return title
}

module.exports = removeHash