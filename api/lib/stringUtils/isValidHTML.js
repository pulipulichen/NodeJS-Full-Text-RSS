const jsdom = require("jsdom");

function isValidHTML(html) {
  try {
    const doc = new jsdom.JSDOM(html);
    if (doc.window.document.querySelector('parsererror')) {
      //return doc.documentElement.querySelector('parsererror').innerText;
      return false
    } else {
      return true;
    }
  }
  catch (e) {
    console.log(e)
    return false
  }
}

module.exports = isValidHTML