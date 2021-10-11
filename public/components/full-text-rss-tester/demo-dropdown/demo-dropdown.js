/* global ClipboardUtils, ipcRenderer, ElectronUtils, dayjs, FileUtils, shell */

module.exports = {
  data () {
    
    return {
    }
  },
  async mounted () {
    setTimeout(() => {
      this.initDropdown()
    }, 500)
  },
  methods: {
    initDropdown () {
      let el = $(this.$el)
      el.find('.ui.selection.dropdown')
        .dropdown({
          //clearable: true
        })
    },
  }
}