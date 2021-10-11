/* global ClipboardUtils, ipcRenderer, ElectronUtils, dayjs, FileUtils, shell */

module.exports = {
  data () {
    
    return {
      cacheKey: 'full-text-rss-tester',
      cacheAttrs: ['query', 'modules', 'mode', 'feedXML'],
      inited: false,
      
      mode: 'url',
      query: '',
      feedXML: '',
      modules: '',
      isLoading: false,
      queryTimer: null,
      
      output: '',
      outputTitle: '',
      outputContent: ''
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