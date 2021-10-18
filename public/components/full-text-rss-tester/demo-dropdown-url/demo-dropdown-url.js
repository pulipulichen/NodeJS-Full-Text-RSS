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
  }
}