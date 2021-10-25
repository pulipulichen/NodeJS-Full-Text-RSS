/* global ClipboardUtils, ipcRenderer, ElectronUtils, dayjs, FileUtils, shell */

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
      
      output: '',
      outputTitle: '',
      outputContent: '',
      preview: '',
      itemsPreview: [],
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
//  computed: {
//  },
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
      this.outputTitle = ''
      this.outputContent = ''
      this.preview = ''
      this.itemsPreview = []
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
                || this.query.startsWith('http://feedproxy.google.com/')
                || this.query.startsWith('https://feedpress.me/')
                || this.query.startsWith('http://feed.')
                || this.query.startsWith('https://feed.')
                || this.query.startsWith('http://rss.')
                || this.query.startsWith('http://feeds.')
                || (this.query.indexOf('/feeds/posts/') > -1)
                || (this.query.indexOf('/posts/atom/') > -1)
                || (this.query.indexOf('/posts/rss/') > -1)
                || (this.query.indexOf('rss2.php') > -1)
                || (this.query.indexOf('/feeds/') > -1)
                || (this.query.indexOf('/rssfeed/') > -1)
                || (this.query.indexOf('/rss/') > -1)
                || (this.query.indexOf('/feed/') > -1)
                || this.query.startsWith('https://www.youtube.com/channel/') 
                || this.query.indexOf('/feeds/videos.xml?channel_id=') > -1 // https://www.youtube.com/feeds/videos.xml?channel_id=UCiWXd0nmBjlKROwzMyPV-Nw
          ) {
          this.loadQueryFeedFromURL()
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
      
      $.post(queryAPI, {
        feedXML: this.feedXML
      },
        (data) => {
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
      this.subURL = baseURL + queryAPI.slice(1)
      
//      console.log(queryAPI)
//      $.get(queryAPI, (xml) => {
//        
//      })
      
      $.ajax({
          type: "GET",
          url: queryAPI,
          cache: false,
          dataType: "xml",
          success: (xml) => {
            //console.log('return')
            //console.log(xml)
            if (typeof(xml) === 'object') {
              xml = (new XMLSerializer()).serializeToString(xml)
            }
            this.output = xml
            //console.log(xml)
            if (this.autoPreview) {
              this.parseItemsPreview()
            }
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
        this.output = ''
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
    
    parseItemsPreview () {
      let feed = this.output
      
      let xmlDoc = $.parseXML( feed )
      let $xml = $( xmlDoc )
      
      let entryList = $xml.find('feed > entry')
      if (entryList.length === 0) {
        entryList = $xml.find('channel > item')
      }
      
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
        let linkElement = $entry.find('link')
        let link = linkElement.attr('href')
        if (!link) {
          link = linkElement.text().trim()
        }
        //console.log(i, ele.innerHTML)
        //console.log($entry.find('title').length, title, link)
        //console.log(i, content.length)
        
        //console.log(i, title, link)
        
        this.itemsPreview.push({
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
          this.itemsPreview.push({
            title,
            content,
            link
          })
        })
      }
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