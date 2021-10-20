/* global ClipboardUtils, ipcRenderer, ElectronUtils, dayjs, FileUtils, shell */


module.exports = {
  data () {
    
    return {
      cacheKey: 'subscription-list',
      cacheAttrs: ['filter'],
      inited: false,
      
      feeds: [],
      filter: '',
      filteredFeeds: [],
      filterTimer: null
    }
  },
//  components: {
//  },
  async mounted () {
    this.dataLoad()
    
    this.inited = true
    
    this.loadFeeds()
  },
  watch: {
    feeds () {
      this.setupFilteredFeeds()
    },
    filter () {
      this.setupFilteredFeeds()
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
    
    loadFeeds () {
      let urlOPML = './opml'
      let urlSub = './subscription-list'
      
      $.getJSON(urlSub, (json) => {
        this.feeds = json
        
        //console.log(json)
        
        
        $.getJSON(urlOPML, (json) => {
          this.feeds = this.feeds.concat(json)
        })
      })
    },
    
    buildFullTextURL (feed) {
      let encodedURL = encodeURIComponent(feed.feedURL)
      
      if (!feed.modules || feed.modules === '') {
        return `./fc/` + encodedURL
      }
      else {
        return `./fc/` + feed.modules + '/' + encodedURL
      }
    },
    
    setupFilteredFeeds () {
      clearTimeout(this.filterTimer)
      
      this.filterTimer = setTimeout(() => {
        this.filteredFeed = this.feeds.filter(({title, feedURL}) => {
          return (this.filter === ''
                  || title.indexOf(this.filter) > -1 
                  || feedURL.indexOf(this.filter) > -1 )
        })
      }, 500)
    }
  }
}