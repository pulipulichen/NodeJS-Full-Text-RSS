/* global ClipboardUtils, ipcRenderer, ElectronUtils, dayjs, FileUtils, shell */

module.exports = {
  data () {
    
    return {
    }
  },
//  async mounted () {
//    $(() => {
//      setTimeout(() => {
//        //console.log('aaa')
//        this.initDropdown()
//      }, 3000)
//    })
//      
//  },
  methods: {
    initDropdown () {
      let el = $(this.$el)
      el.find('.ui.selection.dropdown')
        .dropdown({
          //clearable: true
        })
    },
    loadFeed (feedName) {
      let modules
      let pos = feedName.lastIndexOf('|')
      if (pos > -1) {
        modules = feedName.slice(pos + 1)
        feedName = feedName.slice(0, pos)
      }
      
      //console.log(feedName)
      let url = '/demo/feeds/' + feedName
      $.get(url, (feed) => {
        if (!feed) {
          return false
        }
        
        feed = new XMLSerializer().serializeToString(feed);
        if (feed.length < 40) {
          return false
        }
        //console.log(feed)
        this.$parent.feedXML = feed
        if (modules) {
          this.$parent.modules = modules
        }
      })
    }
  }
}