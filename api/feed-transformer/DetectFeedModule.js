const AddModule = require('./../lib/ModuleManager/AddModule.js')
const FeedChannelLink = require('./../lib/xmlTransformers/FeedChannelLink.js')
const FeedFeedGeneratorURI = require('./../lib/xmlTransformers/FeedFeedGeneratorURI.js')

const DetectFeedModule = function ($, moduleCodesString) {
  let channelLink = FeedChannelLink($)
  if (typeof(channelLink) !== 'string') {
    console.error('channelLink is not a link', moduleCodesString)
    return moduleCodesString
  }
  
  let feedGeneratorURI = FeedFeedGeneratorURI($)
  //console.log(channelLink)
  // $('channel > link:first').text().trim()
  //console.log(channelLink)
  
  let addModules = []
  
  if (channelLink.startsWith('https://www.facebook.com/')) {
    addModules.push('xFB')
  }
  else if (channelLink.startsWith('https://twitter.com/')) {
    addModules.push('xTwitter')
  }
  else if (channelLink.startsWith('https://github.com/')) {
    addModules.push('xGitHub')
  }
  else if (channelLink.startsWith('https://www.emerald.com/insight/publication/')) {
    addModules.push('xEmerald')
  }
  else if (channelLink.startsWith('https://sub-tongli-2020.blogspot.com/')) {
    addModules.push('tMailToBlogger')
    addModules.push('tTongliNewletter')
    addModules.push('cTongliNewletter')
  }
  else if (channelLink.startsWith('https://sub-steam-wishlist-2017.blogspot.com/')) {
    addModules.push('cSteamOnSale')
  }
  else if (channelLink.startsWith('https://soundcloud.com/')) {
    addModules.push('xPodcast')
  }
  else if (channelLink.startsWith('https://www.reddit.com/r/')) {
    addModules.push('xReddit')
  }
  else if (feedGeneratorURI === 'https://www.plurk.com/user/') {
    addModules.push('xSkip')
  }
  else if (channelLink.startsWith('https://www.y' + 'out' + 'ube.com/')
          || channelLink.startsWith('http://www.y' + 'out' + 'ube.com/')) {
    addModules.push('xUB')
  }

  if (channelLink.startsWith('https://sub-nccu-cc-2016.blogspot.com/')) {
    addModules.push('cNCCUMailGatesNotification')
    addModules.push('xSkip')
  }
  
  if (channelLink.startsWith('https://blog.pulipuli.info/')) {
    addModules.push('xPulipuliBlog')
    if (moduleCodesString.indexOf('cPulipuliBlogPinterest') === -1) {
      addModules.push('cPulipuliBlog')
    }
      
  }
  if (channelLink === 'https://buzzorange.com/techorange') {
    addModules.push('cTechOrange')
  }
  if (channelLink === 'http://www.linuxeden.com') {
    addModules.push('fLinuxEden')
  }
  if (channelLink.endsWith('videos.xml?channel_id=UCLgGLSFMZQB8c0WGcwE49Gw')) {
    addModules.push('tGamker')
  }
  if (channelLink === 'http://www.youtube.com/feeds/videos.xml?channel_id=UCK-qc_POQZwWrMg-Pr-oYtg'
    || channelLink === 'http://www.youtube.com/feeds/videos.xml?channel_id=UC6OeJCR9gHsJPVyNhXfK4tA') {
    // 志祺七七 X 圖文不符
    // 四處觀察
    addModules.push('tSH')
  }
  if (channelLink === 'https://www.oschina.net/news/rss') {
    addModules.push('tOSChina')
  }
  if (channelLink === 'https://www.techbang.com/') {
    addModules.push('cTechbang')
  }
  if (channelLink === 'https://www.soft4fun.net') {
    addModules.push('cSoft4fun')
  }
  if (channelLink.startsWith('https://www.linux-apps.com/')) {
    addModules.push('xLinuxAPP')
  }
  if (channelLink.startsWith('https://www.facebook.com/tomchun.tw')) {
    addModules.push('tSH')
  }
  if (channelLink.startsWith('https://www.facebook.com/emuse.com.tw')) {
    addModules.push('tSH')
  }
  if (channelLink.startsWith('https://www.facebook.com/udngame')) {
    addModules.push('tSH')
  }
  if (channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UCvijahEyGtvMpmMHBu4FS2w')) {
    addModules.push('tSH')
  }
  
  
  if (channelLink.startsWith('https://www.ptt.cc/atom/Hearthstone.xml')) {
    addModules.push('fPTTInfo')
    addModules.push('tPTT')
    addModules.push('cPTT')
  }
  
  if (channelLink.startsWith('https://www.solidot.org')) {
    addModules.push('cImgur')
  }
  
  if (channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UCk25FUc8pLiP3A6Zniknxbg')) {
    // 希治閣【遊戲情報科】++ (15)
    addModules.push('fScaryplayTTV')
    //addModules.push('fHasCaptions')
  }

  if (channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UClkSKv9-Geah2gwYu7e9jFw')) {
    // 希治閣【遊戲情報科】++ (15)
    addModules.push('fUBJer')
    //addModules.push('fHasCaptions')
  }

//  if (channelLink.startsWith('https://www.ptt.cc/')) {
//    addModules.push('xPTT')
//  }

  if (channelLink.startsWith('https://pcrookie.com')
    || channelLink.startsWith('https://funtop.tw')) {
    addModules.push('cRemoveNoscript')
  }
  
  if (channelLink.startsWith('https://iamjoyhuang.com')) {
    addModules.push('cIamjoyhuang')
  }
  
  if (channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UC9v3JGut2Z1PxrXEpGzgEAA')) {
    // TESTV
    addModules.push('fTESTVBuy')
  }
  
  if (channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UC4D6eg7KWWiXNJVTXtuyZfA')) {
    // Sky game++ (15)
    addModules.push('fUBSky')
    addModules.push('fHasCaptions')
    addModules.push('tSH')
  }
  
  if (channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UC1BjrXqfmHmBkM2FjBTdg-w')) {
    // https://www.youtube.com/channel/UC1BjrXqfmHmBkM2FjBTdg-w
    // 低分少年 Low Score Boy
    addModules.push('fLowScoreBoy')
    addModules.push('fHasCaptions')
  }
  
  if (channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UCU6nhA37pbvzw-JXhAB87Mg')) {
    // 大閒者
    addModules.push('tRecopapa')
    addModules.push('tSH')
  }
  
  
  if (channelLink === 'http://www.youtube.com/feeds/videos.xml?channel_id=UCK-qc_POQZwWrMg-Pr-oYtg'
      // 志祺七七 X 圖文不符
        || channelLink === 'http://www.youtube.com/feeds/videos.xml?channel_id=UCCkMW93Am1pLfk2nZFKAmbQ'
        // 敖厂长
        || channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UCk25FUc8pLiP3A6Zniknxbg')
        // 希治閣【遊戲情報科】
        || channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UCLgGLSFMZQB8c0WGcwE49Gw')
        // Gamker攻壳官方频道
        || channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UCpmx8TiMv9yR1ncyldGyyVA')
        // Huan
        || channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UC9v3JGut2Z1PxrXEpGzgEAA')
        // TESTV
        || channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UC2Zn5hlv7_hPsLlh_xwcH6g')
        // 邦尼幫你
        || channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UCK-qc_POQZwWrMg-Pr-oYtg')
        // SHIN LI
        || channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UCZ4NwvuGYgFyjnRRJekdnHw')
        // 想做教育家的Klaus++ (15)
        || channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UCdEpz2A4DzV__4C1x2quKLw')
        // PAPAYA 電腦教室++ (15)
        || channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UCU6nhA37pbvzw-JXhAB87Mg')
        // 大閒者++ (15)
        || channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UCQkAUoa28FZfffFI8tTQ71g')
        // 帥狗 HandsomeDoge 
        || channelLink.startsWith('http://www.youtube.com/feeds/videos.xml?channel_id=UCKPflKAE2Y1tm8VSi32iboQ')
        // 老孫聊遊戲 https://www.youtube.com/channel/UCKPflKAE2Y1tm8VSi32iboQ
    ) {
    
    addModules.push('fHasCaptions')
  }
  
  //console.log(channelLink, addModules)
  
  moduleCodesString = AddModule(moduleCodesString, addModules)
  
  return moduleCodesString
}

module.exports = DetectFeedModule
