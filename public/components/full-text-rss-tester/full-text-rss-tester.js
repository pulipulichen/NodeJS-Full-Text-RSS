/* global ClipboardUtils, ipcRenderer, ElectronUtils, dayjs, FileUtils, shell, decodeURI */

let decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      str = str.trim()
      if (str.startsWith('<![CDATA[') && str.endsWith(']]>')) {
        return str.slice(9, -3)
      }
      
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})();

module.exports = {
  data () {
    
    return {
      cacheKey: 'full-text-rss-tester',
      cacheAttrs: ['query', 'modules', 'mode', 'feedXML', 'autoPreview'],
      inited: false,
      
      mode: 'url',
      query: '',
      feedXML: '',
      modules: '',
      isLoading: false,
      queryTimer: null,
      autoPreview: true,
      
      originalRSS: '',
      ChannelTitle: '',
      OriginalChannelTitle: '',
      output: '',
      outputTitle: '',
      outputContent: '',
      preview: '',
      itemsPreview: [],
      originalItemsPreview: [],
      subURL: ''
    }
  },
  components: {
    'demo-dropdown-url': httpVueLoader('./demo-dropdown-url/demo-dropdown-url.vue'),
    'demo-dropdown-feed': httpVueLoader('./demo-dropdown-feed/demo-dropdown-feed.vue'),
  },
  async mounted () {
    
    this.dataLoad()
    
    let parameters = this.getParamters()
    //console.log(parameters)
    if (parameters.u) {
      this.mode = 'url'
      this.query = decodeURIComponent(parameters.u)
      if (parameters.m) {
        this.modules = parameters.m
      }
      else {
        this.modules = ''
      }
      this.inited = true
      this.dataSave()
      //setTimeout(() => {
        let url = location.href.slice(0, location.href.indexOf('?'))
        //console.log(url)
        //location.href = location.href.slice(0, location.href.indexOf('?'))
        location.href = url
      //}, 500)
      return false
    }
    
    this.inited = true
    
    this.loadOutput()
    //this.queryProjectFileList()
    setTimeout(() => {
      //console.log('aaa')
      this.initDropdown()
      
      if (parameters.u) {
        
        this.loadOutput()
      }
    }, 500)
  },
  watch: {
    query () {
      if (this.query !== this.query.trim()) {
        try {
          new URL(this.query.trim())
          this.query = this.query.trim()
          return false
        }
        catch (e) {
          // do nothing
        }
      }
      
      if (!this.query.startsWith('https://') 
              && !this.query.startsWith('http://')) {
        this.query = 'https://' + this.query()
        return false
      }
      
      if (this.query.indexOf('/https%3A%2F%2F') > -1) {
        let query = this.query.slice(this.query.indexOf('/https%3A%2F%2F') + 1)
        query = decodeURIComponent(query)
        this.query = query
        return false
      }
      
      if (this.query.indexOf('/http%3A%2F%2F') > -1) {
        let query = this.query.slice(this.query.indexOf('/http%3A%2F%2F') + 1)
        query = decodeURIComponent(query)
        this.query = query
        return false
      }
      
      this.dataSave()
      this.loadOutput()
    },
    feedXML () {
      this.dataSave()
      this.loadOutput()
    },
    mode () {
      this.dataSave()
      this.loadOutput()
    },
    modules () {
      this.dataSave()
      this.loadOutput()
    },
    autoPreview () {
      this.dataSave()
    },
  },
  computed: {
    // https://feedly.com/i/discover/sources/search/feed/http%3A%2F%2Fpulipuli.myqnapcloud.com%2F304%2Ff%2Fhttps%253A%252F%252Fopeningsource.org%252Ffeed%252F
    addFeedlyURL () {
      return 'https://feedly.com/i/discover/sources/search/feed/' + encodeURIComponent(this.subURL)
    }
  },
  methods: {
    dataLoad () {
      let projectFileListData = localStorage.getItem(this.cacheKey)
      if (!projectFileListData) {
        return false
      }
      try {
        projectFileListData = JSON.parse(projectFileListData)
      }
      catch (e) {
        
      }
      for (let key in projectFileListData) {
        this[key] = projectFileListData[key]
      }
    },
    dataSave () {
      if (this.inited === false) {
        return false
      }
      
      let keys = this.cacheAttrs
      
      let data = {}
      keys.forEach(key => {
        data[key] = this[key]
      })
      
      data = JSON.stringify(data)
      localStorage.setItem(this.cacheKey, data)
    },
    
    // ------------------------
    
    getParamters () {
      let search = location.search.substring(1);
      try {
        return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
      }
      catch (e) {
        return {}
      }
    },
    
    loadOutput () {
      //console.log(this.query)
      
      if (this.mode === 'url' && this.query === '') {
        console.log(this.mode, this.query)
        return false
      }
      if (this.mode === 'feed' && this.feedXML === '') {
        console.log(this.mode, this.query)
        return false
      }
      
      this.output = ''
      this.OriginalChannelTitle = ''
      this.ChannelTitle = ''
      this.originalRSS = ''
      this.outputTitle = ''
      this.outputContent = ''
      this.preview = ''
      this.itemsPreview = []
      this.originalItemsPreview = []
      this.subURL = ''
      
      clearTimeout(this.queryTimer)
      this.queryTimer = setTimeout(() => {
        
        if (this.mode === 'url') {
          try {
            new URL(this.query)
          }
          catch (e) {
            return false
          }
        }
        
        clearTimeout(this.queryTimer)
        
        //console.log(this.query, this.query.startsWith('http://feeds.feedburner.com/') )
        
        if (this.mode === 'feed') {
          this.loadQueryFeed()
        }
        else if (this.query.endsWith('.xml') 
                || this.query.endsWith('.atom') 
                || this.query.endsWith('.axd') 
                || this.query.endsWith('.rss') 
                || this.query.endsWith('/rss.php') 
                || this.query.endsWith('/rss.aspx') 
                || this.query.endsWith('/rss') 
                || this.query.endsWith('/feed') 
                || this.query.endsWith('/feed/') 
                || this.query.endsWith('feed/') 
                || this.query.endsWith('/showFeed?') 
                || this.query.endsWith('?format=feed&type=rss') 
                || this.query.endsWith('?format=feed&type=atom') 
                || this.query.endsWith('-feed') 
                || this.query.endsWith('?feed=rss2') 
                || (this.query.indexOf('rssfeed') > -1 )
                || this.query.startsWith('http://feeds.feedburner.com/') 
                || this.query.startsWith('http://feeds2.feedburner.com/') 
                || this.query.startsWith('https://feeds.feedburner.com/') 
                || this.query.startsWith('feeds.feedburner.com/') 
                || this.query.startsWith('http://feedproxy.google.com/')
                || this.query.startsWith('https://feedpress.me/')
                || this.query.startsWith('http://feed.')
                || this.query.startsWith('https://feed.')
                || this.query.endsWith('.rdf')
                || this.query.startsWith('http://rss.')
                || this.query.startsWith('http://feeds.')
                || (this.query.indexOf('/feeds/posts/') > -1)
                || (this.query.indexOf('/posts/atom/') > -1)
                || (this.query.indexOf('/posts/rss/') > -1)
                || (this.query.indexOf('/showFeed?') > -1)
                || (this.query.indexOf('rss2.php') > -1)
                || (this.query.indexOf('/feeds/') > -1)
                || (this.query.indexOf('/rssfeed/') > -1)
                || (this.query.indexOf('/rss/') > -1)
                || (this.query.indexOf('/feed/') > -1)
                || this.query.startsWith('https://www.youtube.com/channel/') 
                || this.query.indexOf('/feeds/videos.xml?channel_id=') > -1 // https://www.youtube.com/feeds/videos.xml?channel_id=UCiWXd0nmBjlKROwzMyPV-Nw
          ) {
          this.loadQueryFeedFromURL()
          this.loadOriginalRSS()
        }
        else {
          this.loadQueryFullTextParser()
        }
        
      }, 1000)
    },
    loadQueryFeed () {
      this.outputTitle = ''
      this.outputContent = ''
      
      //this.output = this.feedXML
      let queryAPI = './feed-transformer'
      if (this.modules !== '') {
        queryAPI = queryAPI + '/' + this.modules
      }
      
      let cacheFeed = this.feedXML
      
      $.post(queryAPI, {
        feedXML: cacheFeed
      },
        (data) => {
          if (cacheFeed !== this.feedXML) {
            return false
          }
          
          //console.log(data)
          this.output = data
          
          if (this.autoPreview) {
            this.parseItemsPreview()
          }
        }
      )
    },
    loadQueryFeedFromURL () {
      this.outputTitle = ''
      this.outputContent = ''
      
      let queryAPI
      //this.output = this.feedXML
      if (this.modules === '') {
        queryAPI = './f/' + encodeURIComponent(this.query)
      }
      else {
        queryAPI = './f/' + this.modules + '/' + encodeURIComponent(this.query)
      }
      
      //let baseURL = new URL(location.href)
      //this.subURL = baseURL.origin + queryAPI
      let href = location.href
      let baseURL = href.slice(0, href.indexOf('/test.html'))
      this.subURL = baseURL + '/fc/' + queryAPI.slice(4)
      
      //console.log(queryAPI)
//      $.get(queryAPI, (xml) => {
//        
//      })
      
      let cacheQueryAPI = queryAPI
      
      $.ajax({
          type: "GET",
          url: queryAPI,
          cache: false,
          dataType: "xml",
          complete: (xml) => {
            if (cacheQueryAPI !== queryAPI) {
              return false
            }
            
            //console.log('return')
            
            if (xml.responseText) {
              xml = xml.responseText
            }
            
            //console.log(xml)
            
            if (typeof(xml) === 'object') {
              try {
                xml = (new XMLSerializer()).serializeToString(xml)
              }
              catch (e) {
                console.error(e)
                return false
              }
            }
            this.output = xml
            //console.log(xml)
            if (this.autoPreview) {
              this.parseItemsPreview()
            }
          },
          error: (jqXHR, exception) => {
            window.alert('Error: ' + jqXHR.responseText)
            console.error(jqXHR.responseText)
            return false
          }
      });
    },
    loadOriginalRSS () {
      this.outputTitle = ''
      this.outputContent = ''
      let queryAPI = './original-rss-crawler/' + encodeURIComponent(this.query)
      
      let href = location.href
      let baseURL = href.slice(0, href.indexOf('/test.html'))
      let subURL = baseURL + queryAPI.slice(1)
      
      //console.log(subURL)
      //return 
      
      let cacheQueryAPI = queryAPI
      
      $.ajax({
          type: "GET",
          url: queryAPI,
          cache: false,
          dataType: "xml",
          complete: (xml) => {
            if (cacheQueryAPI !== queryAPI) {
              return false
            }
            
            if (xml.responseText) {
              xml = xml.responseText
            }
            
            //console.log(xml)
            
            //console.log('return')
            //console.log(xml)
            if (typeof(xml) === 'object') {
              try {
                xml = (new XMLSerializer()).serializeToString(xml)
              }
              catch (e) {
                console.error(e)
                return false
              }
            }
            this.originalRSS = xml
            //console.log(xml)
            if (this.autoPreview) {
              this.parseOriginalRSSItemsPreview()
            }
          },
          error: (jqXHR, exception) => {
            window.alert('Error: ' + jqXHR.responseText)
            console.error(jqXHR.responseText)
            return false
          }
      });
    },
    loadQueryFullTextParser () {
      let queryAPI
      if (this.modules === '') {
        queryAPI = './full-text-parser/' + encodeURIComponent(this.query)
      }
      else {
        queryAPI = './full-text-parser/' + this.modules + '/' + encodeURIComponent(this.query)
      }
      $.getJSON(queryAPI, (data) => {
        if (!data) {
          window.alert('Full text data error')
          console.error('Full text data error', queryAPI)
          return false
        }

        this.output = ''
        //console.log(data)
        
        this.outputTitle = data.title
        this.outputContent = data.content
        
        if (this.autoPreview) {
          this.parseItemPreview()
        }
      })
    },
    
    parseItemPreview () {
      this.preview = this.outputContent
    },
    parseItemsPreviewFeedProcess (feed) {
      let channelTitle
      
      let output = []
      let xmlDoc
      try {
        xmlDoc = $.parseXML( feed )
      }
      catch (e) {
        console.error(e)
        return false
      }
      let $xml = $( xmlDoc )
      
      let entryList = $xml.find('feed > entry')
      if (entryList.length === 0) {
        entryList = $xml.find('channel > item')
      }
      
      channelTitle = $xml.find('title:first').text().trim()
      
      //console.log('entryList.length', entryList.length, this.itemsPreview.length)
      
      //console.log('entry list count', entryList.length)
      for (let i = 0; i < entryList.length; i++) {
        let $entry = $(entryList[i])
        
        let title = $entry.find('title:first').text().trim()
        //console.log(title)
        let content
        let contentElement = $entry.find('content:first')
        if (contentElement.length > 0) {
          content = decodeEntities(contentElement.html())
          //console.log(contentElement.html())
          //console.log(content)
        }
        else {
          contentElement = $entry.find('description:first')
          if (contentElement.length > 0) {
            content = decodeEntities(contentElement.html())
          }
          else {
            contentElement = $entry.find('media\\:description:first')
            if (contentElement.length > 0) {
              let contentHTML = contentElement.html().trim()
              
              //console.log(contentHTML.slice(-5))
              if (contentHTML.endsWith(']]>')) {
                contentHTML = contentHTML.slice(0, -3)
              }
              //console.log(contentHTML)
              content = contentHTML
            }
          }
        }
        let linkElement = $entry.find('link[type="text/html"]')
        if (linkElement.length === 0) {
          linkElement = $entry.find('link')
        }
        let link = linkElement.attr('href')
        if (!link) {
          link = linkElement.text().trim()
        }
        //console.log(i, ele.innerHTML)
        //console.log($entry.find('title').length, title, link)
        //console.log(i, content.length)
        
        //console.log(i, title, link)
        
        output.push({
          title,
          content,
          link
        })
      }
      
      if (entryList.length === 0) {
        $xml.find('item').each((j, item) => {
          let $item = $(item)

          let title = $item.find('title').text()
          let contentElement = $item.find('description')
          //console.log(contentElement, contentElement.text(), contentElement.html())
          let content = contentElement.text()
          let link = $item.find('link').text()
          //console.log(i, ele.innerHTML)
          //console.log(title, link)
          output.push({
            title,
            content,
            link
          })
        })
      }
      
      return {
        title: channelTitle,
        previews: output
      }
    },
    
    parseItemsPreview () {
      let feed = this.output
      let {title, previews} = this.parseItemsPreviewFeedProcess(feed)
      this.ChannelTitle = title
      this.itemsPreview = this.itemsPreview.splice(0,0).concat(previews)
    },
    parseOriginalRSSItemsPreview () {
      let feed = this.originalRSS
      let {title, previews} = this.parseItemsPreviewFeedProcess(feed)
      this.OriginalChannelTitle = title
      this.originalItemsPreview = this.originalItemsPreview.splice(0,0).concat(previews)
    },
    copyTextToClipboard (text) {
      if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
      }
      navigator.clipboard.writeText(text).then(function() {
        //console.log('Async: Copying to clipboard was successful!');
      }, function(err) {
        console.error('Async: Could not copy text: ', err);
      });
    },
    copySubURL () {
      this.copyTextToClipboard(this.subURL)
    },
    
    scrollIntoView (id) {
      let element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      }
    },
    
    getMMDDHHMM () {
      var date = new Date();
      var gg = date.getUTCDate();
      var mm = (date.getUTCMonth() + 1);

      if (gg < 10) {
          gg = "0" + gg;
      }

      if (mm < 10) {
          mm = "0" + mm;
      }

      var cur_day = mm + "" + gg;

      var hours = date.getUTCHours()
      var minutes = date.getUTCMinutes()
      var seconds = date.getUTCSeconds();

      if (hours < 10) {
          hours = "0" + hours;
      }

      if (minutes < 10) {
          minutes = "0" + minutes;
      }

      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      return cur_day + "-" + hours + "" + minutes
    },
    
    addRandomToken () {
      let modulesParts = this.modules.split(',')
      if (modulesParts.length === 1 && modulesParts[0] === '') {
        modulesParts = []
      }
      
      let hasRandomToken = false
      for (let i = 0; i < modulesParts.length; i++) {
        let m = modulesParts[i]
        if (m.startsWith('$') && m.endsWith('$')) {
          m = '$' + this.getMMDDHHMM() + '$'
          modulesParts[i] = m
          hasRandomToken = true
        }
      }
      
      if (hasRandomToken === false) {
        modulesParts.push('$' + this.getMMDDHHMM() + '$')
      }
      
      //console.log(modulesParts)
      
      this.modules = modulesParts.join(',')
    },
    
    // -----------------------
    
    initDropdown () {
      let el = $(this.$el)
      el.find('.ui.selection.dropdown')
        .dropdown({
          //clearable: true
        })
    },
    
    
  }
}