const ModuleManager = require('./../lib/ModuleManager/ModuleManager.js')

const FeedTransformer = async function (feedXML, modules) {
  
  feedXML = await ModuleManager(feedXML, modules, 'x')
  
  return feedXML
}

module.exports = FeedTransformer