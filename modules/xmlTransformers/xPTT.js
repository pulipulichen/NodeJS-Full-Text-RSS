const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const xPTT = async function ($, moduleCodesString) {
  await FeedItemEach($, async (item, i) => {
    item.remove()
  })
  
  return $
}

module.exports = xPTT