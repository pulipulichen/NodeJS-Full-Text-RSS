/* global ClipboardUtils, ipcRenderer, ElectronUtils, dayjs, FileUtils, shell */

module.exports = {
  data () {
    
    return {
      subscribeList: []
    }
  },
  mounted () {
    this.loadSubscribeList()
  },
//  async mounted () {
//    $(() => {
//      setTimeout(() => {
//        //console.log('aaa')
//        this.initDropdown()
//      }, 3000)
//    })
//  },
  methods: {
    initDropdown () {
      let el = $(this.$el)
      //console.log(el)
      el.find('.ui.selection.dropdown')
        .dropdown({
          //clearable: true
        })
    },
    loadSubscribeList () {
      //console.log('/subscribe-list')
      $.get('/subscribe-list', (list) => {
        //console.log(list)
        this.subscribeList = list
      })
    },
    loadURL (feedName) {
      //console.log(feedName)
      let modules = ''
      let pos = feedName.lastIndexOf('|')
      if (pos > -1) {
        modules = feedName.slice(pos + 1)
        feedName = feedName.slice(0, pos)
      }
      
      this.$parent.query = feedName
      this.$parent.modules = modules
    },
    buildRequestAPIURL (feedURL, modules) {
      let url = feedURL
      if (modules && modules !== '') {
        url = url + '|' + modules
      }
      return url
    }
  }
}