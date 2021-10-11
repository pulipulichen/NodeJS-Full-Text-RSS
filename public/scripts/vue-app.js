/* global appData, appComputed, appWatch, appMethods, appMount, appComponents */
// 不需要變動

let app = {
  el: '#app',
  data: appData,
  components: appComponents,
  computed: appComputed,
  mounted: appMount,
  watch: appWatch,
  methods: appMethods
}

app = new Vue(app)
