/* global ClipboardUtils, ipcRenderer, ElectronUtils, dayjs, FileUtils, shell */

let decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
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
      itemsPreview: []
    }
  },
  components: {
    'demo-dropdown-url': httpVueLoader('./demo-dropdown-url/demo-dropdown-url.vue'),
    'demo-dropdown-feed': httpVueLoader('./demo-dropdown-feed/demo-dropdown-feed.vue'),
  },
  async mounted () {
    this.dataLoad()
    
    this.inited = true
    
    this.loadOutput()
    //this.queryProjectFileList()
    setTimeout(() => {
      //console.log('aaa')
      this.initDropdown()
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
  computed: {
  },
  methods: {
    dataLoad () {
      let projectFileListData = localStorage.getItem(this.cacheKey)
      if (!projectFileListData) {
        return false
      }
      
      projectFileListData = JSON.parse(projectFileListData)
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
    
    loadOutput () {
      //console.log(this.query)
      if (this.mode === 'url' && this.query === '') {
        return false
      }
      if (this.mode === 'feed' && this.feedXML === '') {
        return false
      }
      
      this.output = ''
      this.outputTitle = ''
      this.outputContent = ''
      this.preview = ''
      this.itemsPreview = []
      
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
        
        if (this.mode === 'feed' || this.query.endsWith('.xml')) {
          this.loadQueryFeed()
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
      let queryAPI = '/feed-transformer'
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
    loadQueryFullTextParser () {
      let queryAPI
      if (this.modules === '') {
        queryAPI = '/full-text-parser/' + encodeURIComponent(this.query)
      }
      else {
        queryAPI = '/full-text-parser/' + this.modules + '/' + encodeURIComponent(this.query)
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
      for (let i = 0; i < entryList.length; i++) {
        let $entry = $(entryList[i])
        
        let title = $entry.find('title:first').text()
        //console.log(title)
        let content
        let contentElement = $entry.find('content:first')
        if (contentElement.length > 0) {
          content = decodeEntities(contentElement.html())
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
        let link = $entry.find('link').attr('href')
        //console.log(i, ele.innerHTML)
        //console.log($entry.find('title').length, title, link)
        console.log(i, content.length)
        
        this.itemsPreview.push({
          title,
          content,
          link
        })
      }
      
      $xml.find('item').each((i, item) => {
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