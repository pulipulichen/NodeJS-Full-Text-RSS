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
      
      //console.log(this.feeds)
      
      this.filterTimer = setTimeout(() => {
        this.filteredFeeds = this.feeds.filter(({title, feedURL}) => {
          return (this.filter === ''
                  || title.toLowerCase().indexOf(this.filter.toLowerCase()) > -1 
                  || feedURL.toLowerCase().indexOf(this.filter.toLowerCase()) > -1 )
        })
        //console.log(this.filteredFeeds)
      }, 500)
    },
    buildRowClassName (feed) {
      let classNames = []
      
      if (feed.status && feed.status !== 'Subscribable') {
        if (feed.status === 'Unreachable') {
          classNames.push('negative')
        }
        else if (feed.status === 'Not RSS') {
          classNames.push('warning')
        }
        
      }
      
      return classNames.join(' ')
    },
    
    buildTestURL (feed) {
      let encodedURL = encodeURIComponent(feed.feedURL)
      
      let parameters = [
        'u=' + encodedURL
      ]
      
      if (feed.modules && feed.modules !== '') {
        parameters.push('m=' + feed.modules)
      }
      
      return './test.html?' + parameters.join('&')
    },
  }
}
