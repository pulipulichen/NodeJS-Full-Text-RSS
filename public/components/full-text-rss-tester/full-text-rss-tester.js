/* global ClipboardUtils, ipcRenderer, ElectronUtils, dayjs, FileUtils, shell */

module.exports = {
  data () {
    
    return {
      cacheKey: 'full-text-rss-tester',
      cacheAttrs: ['query'],
      inited: false,
      
      query: '',
      isLoading: false,
      queryTimer: null,
      
      output: '',
      outputTitle: '',
      outputContent: ''
    }
  },
  components: {
    'demo-dropdown': httpVueLoader('./demo-dropdown/demo-dropdown.vue')
  },
  async mounted () {
    this.dataLoad()
    
    this.inited = true
    
    this.loadOutput()
    setTimeout(() => {
      this.initDropdown()
    }, 500)
    //this.queryProjectFileList()
  },
  watch: {
    query () {
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
    
    // -------------------------
    
    initDropdown () {
      let el = $(this.$el)
      el.find('.ui.selection.dropdown')
        .dropdown({
          //clearable: true
        })
    },
    
    // ------------------------
    
    loadOutput () {
      console.log(this.query)
      if (this.query === '') {
        return false
      }
      
      clearTimeout(this.queryTimer)
      this.queryTimer = setTimeout(() => {
        
        try {
          new URL(this.query)
        }
        catch (e) {
          return false
        }
        
        clearTimeout(this.queryTimer)
        
        
        if (this.query.endsWith('.xml')) {
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
    },
    loadQueryFullTextParser () {
      let queryAPI = '/full-text-parser/' + encodeURIComponent(this.query)
      $.getJSON(queryAPI, (data) => {
        this.output = ''
        this.outputTitle = data.title
        this.outputContent = data.content
      })
    }
  }
}