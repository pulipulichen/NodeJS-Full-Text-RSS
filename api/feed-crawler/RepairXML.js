const xmlChecker = require('xmlchecker')

const RepairXML = async function (xml) {
  if (await checkXML(xml)) {
    return xml 
  }
  
  // -------------
  
  xml = xml.split('&nbsp;').join(' ')
  xml = xml.split('').join(' ')

  return xml
}

const checkXML = async function(xml) {
  let checkResult = false
  try {
    checkResult = await xmlChecker.check(xml)
  }
  catch (e) {}
  //console.log(checkResult)
  return checkResult
}

module.exports = RepairXML