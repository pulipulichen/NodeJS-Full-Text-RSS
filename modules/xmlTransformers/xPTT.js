const FeedItemEach = require('./../../api/lib/xmlTransformers/FeedItemEach.js')
const ModuleManager = require('./../../api/lib/ModuleManager/ModuleManager.js')

const xPTT = async function ($, moduleCodesString) {
  await FeedItemEach($, async (item, i) => {
    //console.log(i, item.find('title').text())
    //item.remove()
    
    let match = await ModuleManager(item, moduleCodesString, 'f')
    if (match === false) {
      item.remove()
    }
  })
  
  return $
}

module.exports = xPTT