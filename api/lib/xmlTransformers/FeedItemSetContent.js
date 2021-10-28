const encode = require('html-entities').encode
const decode = require('html-entities').decode

const isValidHTML = require('./../stringUtils/isValidHTML.js')

const FeedItemSetContent = function (item, content) {
  if (!content || content.trim() === '') {
    return false
  }
  
  //content = content.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
  content = content.replace(/[\u0000-\u0008\u000B\u001F\u007F-\u009F]/g, "")  
  
  //console.log('============')
  //console.log(content)
  //console.log('============')
  /*
  content = `<div>



<p>身為一個macOS平台的使用者，您是如何選擇Mac螢幕錄影軟體呢？這個問題我也常問自己，因為在Windows上有相當多的工具可以挑選，但在轉移到Macbook陣營後，才發現Mac上好的螢幕錄製工具並沒有想像中多，這對一些有這方面需求的用戶而言真的很不方便，會造成操作效率上的低落，所以在這次的企劃中，特別評測了7款好用的螢幕錄影工具，其中包含免費與付費的軟體，並以我個人觀點列出各自的優缺點供大家參考。</p>
<p><span id="more-2448"></span></p><div style="text-align: center">




</div><p></p>
<h2 class="extcss">Movavi Screen Recorder</h2>
<p><a href="https://www.movavi.com/zh/screen-recorder/" rel="noopener" target="_blank">Movavi Screen Recorder</a>第一眼給我的印象就是介面相當清爽，由於它支援繁體語系，加上設定方面簡單易懂，用戶很快的就可以進行操作，也可以針對畫面速率或音訊品質進行調整，並選擇是否要錄製人聲、系統音訊、Webcam、應用程式、即時串流、網路研討會等，要滿足生活或工作上的錄製需求都不成問題，其中比較讓我欣賞的一點是用戶可以調降對Retina的錄影品質，避免錄製完的檔案相當的大，當然這要看個人需求而定。</p>
<p><img loading="lazy" class="aligncenter" src="https://1.bp.blogspot.com/-ysZUAOdW7a4/YXYYuhZeQEI/AAAAAAAAdU4/Yr6KtPvBPNMvaxhfzR7lL2EzczZCuJvKwCNcBGAsYHQ/s0/J1069-06-movavi-screen-recorder-setting.png" alt="Movavi Screen Recorder設定畫面" height="500" width="640"></p>
<p>錄製過程中可以即時的進行塗鴨，對於想要標示重點的人來說是個還蠻實用的功能，不過如果可以像螢幕擷圖一樣內建一些常見的箭頭、圖形等註釋符號，效果應該會更棒。此外，錄製完的影片可以進行簡單的剪輯，將一些不要的片段刪除，但因為產品定位的問題，若要做進階的影片編輯，則需要配合<a href="https://www.jinnsblog.com/tag/movavi-video-editor" rel="noopener" target="_blank">Movavi Video Editor</a>來完成，值得一提的是在影片輸出時，除了AVI、MP4、MKV等幾個常見格式外，還貼心支援了GIF、WEBM這二種格式，節省了許多額外另行轉檔的時間。</p>
<p><img loading="lazy" class="aligncenter" src="https://1.bp.blogspot.com/-Hp5FVgNEJCs/YXYkq3paeKI/AAAAAAAAdVM/gyopOuIp5PgcWJUwtrGYjkjohV4yv8PmQCNcBGAsYHQ/s0/J1069-09-movavi-screen-recorder-edit.png" alt="Movavi Screen Recorder螢幕錄影" height="495" width="762"></p>
<p>Movavi Screen Recorder 同時也支援螢幕擷圖，可以直接加入註釋符號(箭頭、圖形、文字等)，足夠應付大部分的擷圖需求。</p>
<p><img loading="lazy" class="aligncenter" src="https://1.bp.blogspot.com/-wkttMeDXEWc/YXYYun2N9rI/AAAAAAAAdU0/7mV2cag1Uu8IoW5A2Vo-Ta6gEmRssjm-wCNcBGAsYHQ/s0/J1069-08-movavi-screenshot.png" alt="Movavi Screen Recorder螢幕擷圖" height="454" width="762"></p>
<p>整體來說，程式運作的過程蠻穩定的，沒有發生當掉或功能無法使用的情況，維持著Movavi產品一貫的高水準，評測體驗相當不錯。</p>
<h5 class="extcss">優點</h5>
<ul>
<li>支援繁體中文語系，操作介面友善，可以快速上手</li>
<li>錄製過程中可即時進行塗鴨，進行重點標示</li>
<li>同時支援螢幕錄影與擷圖功能</li>
<li>可排程錄製影片</li>
<li>軟體的性價比高</li>
</ul>
<h5 class="extcss">缺點</h5>
<ul>
<li>2022的新版本只有7天的試用期</li>
<li>試用版輸出的影片中會添加Movavi浮水印</li>
<li>不適合用來直接錄製遊戲畫面</li>
<li>影片後製功能較少</li>
</ul>
<h2 class="extcss">QuickTime Player</h2>
<p><a href="https://support.apple.com/zh_TW/downloads/quicktime" rel="noopener" target="_blank">QuickTime Player</a>是Mac內建的錄影、擷圖軟體，不用額外安裝就可以直接使用，臨時需要時會相當方便，它支援了螢幕錄製、畫面擷取以及簡單影片剪輯、影片轉檔功能，但缺少一些彈性的調整，例如無法只錄製系統聲音，且對於「螢幕錄製」的功能來說，在目前測試的版本找不到「暫停」錄影的選項，這點在實際的操作面上是比較不方便的，所以給它的評語是簡單易用，但不適合專業或有進階需求的用戶。</p>
<p><img loading="lazy" class="aligncenter" src="https://1.bp.blogspot.com/-d_SDPVmo_qE/YWQSFPsSsCI/AAAAAAAAdTk/fKzhUqSFRlkN_rYgY0s-dQI6b-pA0L1nACNcBGAsYHQ/s0/J1069-01-macos-quciktime.png" alt="Mac QuickTime" height="482" width="760"></p>
<h5 class="extcss">優點</h5>
<ul>
<li>Mac內建的音訊與螢幕錄製、畫面擷取工具，無需額外安裝，隨取隨用</li>
<li>具備簡易的影片剪輯以及轉檔功能</li>
<li>操作介面簡易，容易上手</li>
<li>完全免費使用，沒有浮水印、影片錄製時間等限制</li>
</ul>
<h5 class="extcss">缺點</h5>
<ul>
<li>錄製後的影片檔案太大，有時一場會議錄製下來檔案大小就需要以GB來計算，對硬碟容量的消耗不小</li>
<li>無法單獨錄製系統的聲音</li>
<li>新增螢幕錄製時，無法暫停錄影</li>
<li>無法調製影片錄製時的品質，例如：FPS</li>
</ul>
<h2 class="extcss">Camtasia</h2>
<p><a href="https://www.techsmith.com/video-editor.html" rel="noopener" target="_blank">Camtasia</a>大家應該算是蠻耳熟能詳的，是款非常專業的影片錄製與編輯工具，不管是要錄製人聲、系統音訊或Webcam都沒問題，然而這套產品在定位上除了螢幕錄製的功能外，我認為它更強調影片編輯能力，用戶可以在錄製影片後搭配內建的後製功能來進行不同的應用，例如：添加或擴充素材(箭頭、對話框、圖示等)、音訊編輯、影片剪輯、套用各式特效等等，同時也整合了各大社交網站，可以輕鬆的進行影片分享，不過想要使用這些進階功能，當然需要付出相對的訂購成本才可享用。此外，如果各位對於影片的編輯需求不大，只是想單純的錄製影片，那麼Camtasia的姐妹品<a href="https://www.techsmith.com/screen-capture.html" rel="noopener" target="_blank">Snagit</a>可能更適合你。</p>
<p><img loading="lazy" class="aligncenter" src="https://1.bp.blogspot.com/-6Mv_m2RBYJI/YXVral8H8aI/AAAAAAAAdUs/K_QuhOzgofk2lq6Xs9fNlTp4v6KGp32FQCNcBGAsYHQ/s0/J1069-05-techsmith-camtasia.png" alt="TechSmith Camtasia 螢幕錄製工具" height="463" width="762"></p>
<h5 class="extcss">優點</h5>
<ul>
<li>可依據需求設定不同的錄影參數，滿足不同的錄製場景</li>
<li>可錄製人聲、系統聲、Webcam，並內建強大的影片後製能力</li>
<li>豐富的素材庫與特效，可為影片增添不同的風貌</li>
</ul>
<h5 class="extcss">缺點</h5>
<ul>
<li>沒有繁體中文語系</li>
<li>軟硬體資源需求較大，以我測試的2021版本來看，光安裝檔就超過500MB</li>
<li>無推出免費版本，試用版的日期則為30天，且影片會有浮水印</li>
<li>付費方案過於昂貴</li>
</ul>
<h2 class="extcss">OBS Studio</h2>
<p><a href="https://obsproject.com/" rel="noopener" target="_blank">OBS Studio</a>是一款可用來錄製螢幕和網路直播的免費工具，尤其是串流直播的功能相當豐富，例如：無限數量的場景切換、視窗可自由排版，還有許多的細部參數可供調整，進而達到直播效果的最佳化，受到不少直播主的喜愛，當然，要進行螢幕錄製的話也可以輕易辦到，不管是錄影畫質、格式、編碼等，一樣可以依需求自訂，只是有些術語對於入門者來說可能會太過深奧，介面上較為複雜，需要一點時間學習，整體來說是一套自由度蠻高的工具。</p>
<p><img loading="lazy" class="aligncenter" src="https://1.bp.blogspot.com/-HHrf1Z97R4s/YWvVFjzQdDI/AAAAAAAAdUI/n9y3YopJaAckYSnjnfpF7OiijTUO1bwoACNcBGAsYHQ/s0/J1069-02-obs-studio.png" alt="OBS Studio 直播與螢幕錄影" height="585" width="760"></p>
<h5 class="extcss">優點</h5>
<ul>
<li>完全免費，且支援Windows、Linux、Mac等平台</li>
<li>影片不會加入廣告的浮水印</li>
<li>同時具備串流直播與螢幕錄影的功能</li>
<li>可供調整的參數相當多，自由度頗高</li>
</ul>
<h5 class="extcss">缺點</h5>
<ul>
<li>介面設計上不夠直覺，會有一種望之卻步的感覺</li>
<li>操作及設定上相對複雜，對於入門者來說需要一些摸索的時間</li>
<li>無客服資源，有問題需從社群中取得協助</li>
</ul>
<h2 class="extcss">ApowerRec</h2>
<p><a href="https://www.apowersoft.tw/record-all-screen" rel="noopener" target="_blank">ApowerRec</a>在這次的評測體驗中也算相當不錯的，首先，它支援繁體中文語系、操作介面簡潔，降低了許多操作的門檻，即便第一次使用也很容易上手；再者，影片錄製的功能也算齊全，包含人聲、系統音訊或Webcam等幾個主要來源都可支援。</p>
<p><img loading="lazy" class="aligncenter" src="https://1.bp.blogspot.com/-Bn3uuohrz6I/YXbFlsq59CI/AAAAAAAAdVU/WiMjIVcahL8y4OKmdK5lh6xX97lZfdzXgCNcBGAsYHQ/s0/J1069-10-ApowerREC-setting.png" alt="ApowerREC設定畫面" height="578" width="762"></p>
<p>影片錄製時亦有塗鴨功能，其他諸如排程錄影、自動分割影片等也是一大特色，很可惜的是有許多功能在Mac上無法使用，只支援Windows平台，例如縮放、螢幕擷圖(錄影中的畫面擷圖是支援的)、調整音訊參數等，不過若單純以螢幕錄製的角度來切入，ApowerRec仍然不失為一款好工具。</p>
<p><img loading="lazy" class="aligncenter" src="https://1.bp.blogspot.com/-_Y0zqCRDVXE/YXbFltCkKWI/AAAAAAAAdVY/AC5m3_pHa3UOnA_8_6WtjcadNzlqVzAZACNcBGAsYHQ/s0/J1069-11-ApowerREC-screen-recorder.png" alt="說明" height="440" width="762"></p>
<h5 class="extcss">優點</h5>
<ul>
<li>支援繁體中文語系</li>
<li>介面簡潔、入門容易</li>
<li>錄影時支援豐富的塗鴨功能</li>
</ul>
<h5 class="extcss">缺點</h5>
<ul>
<li>試用版的錄製時間只有3分鐘</li>
<li>試用版的錄製影片會添加浮水印</li>
<li>幾個實用的功能只支援Windows版本，例如：遊戲錄製模式、縮放功能、螢幕擷圖、音訊設置等</li>
<li>無影片剪輯或轉檔功能</li>
<li>售價偏高一點點</li>
</ul>
<h2 class="extcss">Icecream Screen Recorder</h2>
<p><a href="https://icecreamapps.com/Screen-Recorder/" rel="noopener" target="_blank">Icecream Screen Recorder</a>這名稱對於大家來說可能比較陌生一點，但它同樣是一款支援螢幕錄影與擷圖的工具，並可同時錄製螢幕和Webcam，不過在Mac平台中，如果你要錄製系統聲音的話，要額外安裝soundflower元件才行。此外，不管是錄影或擷圖功能，都可以在過程中加入一些文字、箭頭、圖形等註釋，對於有教學需求的用戶來說還蠻方便的，可惜的是評測過程中，在Mac平台上的表現不是很穩定，有些錄影功能無法正常使用，但擷圖功能則表現出色。</p>
<p><img loading="lazy" class="aligncenter" src="https://1.bp.blogspot.com/-_f1eE49dGg4/YW5z2PX2ynI/AAAAAAAAdUg/0SNsQ3tpDdE1j2GQUZtQz-x23EHz5mrhQCNcBGAsYHQ/s0/J1069-04-icecream-screen-recorder.png" alt="Icecream Screen Recorder" height="397" width="762"></p>
<h5 class="extcss">優點</h5>
<ul>
<li>同時支援螢幕錄影與擷圖功能，擷圖功能表現出色</li>
<li>可以在錄影或擷圖過程中加入註釋(Annotation)</li>
<li>錄製後的成果可以從管理介面中統一管理</li>
</ul>
<h5 class="extcss">缺點</h5>
<ul>
<li>不支援繁體中文語系</li>
<li>免費版本只能錄製5分鐘的影片</li>
<li>多數優秀功能需要付費才可使用</li>
<li>Mac上的執行穩定性不佳，會無預警的結束程式</li>
</ul>
<h2 class="extcss">Screencast-O-Matic</h2>
<p><a href="https://screencast-o-matic.com/" rel="noopener" target="_blank">Screencast-O-Matic</a>也是非常著名的一套螢幕錄影工具，大約10年也曾介紹過它的操作方式，記得那時不需要安裝任何軟體，只要電腦中具備Java的執行環境，就可以透過網頁來啟動錄製程式，如今10年過去了，在功能上也增強了不少，例如在影片錄製時可以進行繪製、影片後製功能、匯入音訊與字幕、同時錄製螢幕和Webcam等，也可以將影片上傳至官方雲端儲存、發佈影片至各大雲端空間或社交網站，不過上述功能有些是需要付費才可以使用的，各位可以視需求選擇<a href="https://screencast-o-matic.com/plans" rel="noopener" target="_blank">不同的訂購方案</a>。另外，這裡要提醒一點，目前的版本需要安裝一個小程式才可以正常的使用該工具，而在進行影片錄裂時，只要有登入會員帳號，就可以在離線的狀況下進行影片錄製或擷圖，否則必需透過官方網頁來啟用相關功能。</p>
<p><img loading="lazy" class="aligncenter" src="https://1.bp.blogspot.com/-uBzJIP1g2L4/YWwowBwqiHI/AAAAAAAAdUU/P3Krx9si1CQa-oB46y8MQrMNO461XpAOgCNcBGAsYHQ/s0/J1069-03-screen-o-matic.png" alt="Screencast-o-matic" height="428" width="762"></p>
<h5 class="extcss">優點</h5>
<ul>
<li>有提供免費的版本供用戶</li>
<li>支援多平台，例如：Windows、Mac、iPhone、iPad、Android、Chromebook等</li>
<li>介面簡單易懂，入門快速</li>
<li>支援影片錄製與螢幕擷圖功能</li>
<li>可同時錄製電腦螢幕與Webcam</li>
<li>具有雲端平台供會員上傳影片</li>
</ul>
<h5 class="extcss">缺點</h5>
<ul>
<li>不支援繁體中文語系(有簡體)</li>
<li>免費版在輸出影片時會附加浮水印，且每段影片有15分鐘的上限</li>
<li>大多數功能需要進行付費，例如錄製系統聲音、影片及音訊的素材</li>
<li>如果沒有登入會員帳號的話，則需要由網頁來啟用影片錄製功能，即要在連網的狀況下才可使用，此點較為不便</li>
</ul>
<p>小結：在這次的評測中，我個人比較在意的重點是這些工具在Mac平台上的表現，包含軟體的穩定度、功能是否符合需求、是否擁有高性價比等。從評測的結果來看，如果各位非免費軟體不可，那麼OBS Studio就是你的選擇，但你需要花一段時間去適應其介面與操作，而如果你對錄影的需求很頻繁，長期來說擁有一套容易操作且多功能的工具是比較有效率的，從這個角度切入，則私心推薦Movavi Screen Recorder給大家，因為它的功能雖然不是所有評測軟體中最多的，卻也足夠滿足絕大部分的錄影情境，而且它的運作穩定、表現在水準之上、性價比高，值得推薦。</p>
<p>延伸閱讀：<br>
．<a href="https://www.jinnsblog.com/2021/04/add-chroma-key-to-video.html" rel="noopener" target="_blank">6款最好用的影片去背工具</a></p>
<div style="text-align: center;margin:20px 0px 10px 0px">




</div></div>`
  */
  
  // 確認content是否是HTML
  if (!isValidHTML(content)) {
    console.log('=============')
    console.log(content)
    console.log('=============')
    console.error('Invalid HTML')
    return false
  }
  
  
  let element = item.find('entry > description:first')
  if (element.length === 1) {
    if (!content.startsWith('<![CDATA[')) {
      content = '<![CDATA[' + content
    }
    if (!content.endsWith(']]>')) {
      content = content + ']]>'
    }
    
    //console.log(1)
    return element.text(content)
  } 
  
  element = item.find('item > description:first')
  if (element.length === 1) {
    content = decode(content)
    
    while (content.indexOf('&nbsp;') > -1) {
      content = content.split('&nbsp;').join(' ')
    }
    
    if (!content.startsWith('<![CDATA[')) {
      content = '<![CDATA[' + content
    }
    if (!content.endsWith(']]>')) {
      content = content + ']]>'
    }
    
    //content = encode(content)
    
    //console.log(1)
    //console.log('[[[', content, ']]]')
    
    element.html(content)
     
    //console.log('[[[', element.text(), ']]]')
    return true
  } 
  
  // -------------
  
  element = item.find('entry > content:first')
  if (element.length === 1) {
    content = encode(content)
    //console.log(2)
    return element.text(content)
  }
  
  // -------------
  
  element = item.find('media\\:description:first')
  if (element.length === 1) {
    //console.log(3, content)
    /*
    if (!content.startsWith('<![CDATA[')) {
      content = '<![CDATA[' + content
    }
    if (!content.endsWith(']]>')) {
      content = content + ']]>'
    }
    
    return element.text(content)
    */
    //return element.text(encode(content))
    //content = encode(content)
    //return item.append(`<content>${content}</content>`)
    
    if (!content.startsWith('<![CDATA[')) {
      content = '<![CDATA[' + content
    }
    if (!content.endsWith(']]>')) {
      content = content + ']]>'
    }
    
    return item.append(`<content>${content}</content>`)
  }
  
  //console.log(item.html())
  //throw Error('selector is not found')
  //console.log('[INFO] FeedItemSetContent: content selector is not found.')
  
  content = encode(content)
  item.append(`<content>${content}</content>`)
}

module.exports = FeedItemSetContent