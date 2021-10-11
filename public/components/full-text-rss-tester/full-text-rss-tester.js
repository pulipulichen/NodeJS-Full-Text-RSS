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
      
      output: ''
    }
  },
  async mounted () {
    this.dataLoad()
    
    this.inited = true
    
    this.loadOutput()
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
    loadOutput () {
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
          
        }
        else {
          let queryAPI = '/full-text-parser/' + encodeURIComponent(this.query)
          $.get(queryAPI, (data) => {
            this.output = data
          })
        }
        
      }, 1000)
    }
  }
}