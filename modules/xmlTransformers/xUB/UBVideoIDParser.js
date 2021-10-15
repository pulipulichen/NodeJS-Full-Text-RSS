/**
 * https://gist.github.com/rodrigoborgesdeoliveira/987683cfbfcc8d800192da1e73adc486
 */
module.exports = function (url) {

  if (!url) {
    return undefined
  }

  if (url.indexOf('user/', 5) === 0) { // 1.
    return false
  }

  //if ( preg_match('/^[a-zA-Z0-9\-\_]{11}$/', $url)) { // 2.
  //return $url;
  if (/^[a-zA-Z0-9\-\_]{11}$/.test(url)) {
    return url
  }

  let matchResult
  matchResult = url.match(/(?:watch\?v=|v\/|embed\/|ytscreeningroom\?v=|\?v=|\?vi=|e\/|watch\?.*vi?=|\?feature=[a-z_]*&v=|vi\/)([a-zA-Z0-9\-\_]{11})/)
  if (matchResult) {
    return matchResult[1]
  }

  matchResult = url.match(/([a-zA-Z0-9\-\_]{11})(?:\?[a-z]|\&[a-z])/)
  if (matchResult) {
    return matchResult[1]
  }
  
  matchResult = url.match(/u\/1\/([a-zA-Z0-9\-\_]{11})(?:\?rel=0)?$/)
  if (matchResult) {
    return false
  }
  
  matchResult = url.match(/(?:watch%3Fv%3D|watch\?v%3D)([a-zA-Z0-9\-\_]{11})[%&]/)
  if (matchResult) {
    return matchResult[1]
  }

  // 7. Rules for special cases
  matchResult = url.match(/watchv=([a-zA-Z0-9\-\_]{11})&list=/)
  if (matchResult) {
    return matchResult[1]
  }

  return false
}