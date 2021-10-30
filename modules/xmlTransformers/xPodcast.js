
const xPodcast = async function ($, moduleCodesString) {
  
  //$('channel > link').text('http://blog.pulipuli.info')
  /*
  $('channel > title').text('<![CDATA[ 志祺七七#shorts ]]>')
  
  $('channel > image > title').text('test')
  
  $('atom\\:link').remove()
  
  $('soundon\\:d').remove()
  $('soundon\\:searchId').remove()
  $('soundon\\:importFeedUrl').remove()
  
  $('dc\\:creator').remove()
  
  $('itunes\\:author').remove()
  $('itunes\\:owner > itunes\\:name').text('<![CDATA[ 志祺七七#shorts ]]>')
  */
  $('itunes\\:new-feed-url').remove()
  //$('itunes\\:new-feed-url').text('http://pc-aiec-2021.pulipuli.info:3000/f/fNorgeNewFolder/https%3A%2F%2Ffeeds.soundon.fm%2Fpodcasts%2Fecd31076-d12d-46dc-ba11-32d24b41cca5.xml')
  return $
}

module.exports = xPodcast