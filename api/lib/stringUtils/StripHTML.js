/**
 * https://stackoverflow.com/a/822464
 */
const StripHTML = function (str) {
  return str.replace(/<[^>]*>?/gm, '');
}

module.exports = StripHTML