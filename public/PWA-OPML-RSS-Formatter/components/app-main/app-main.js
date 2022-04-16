/* global ClipboardUtils */

let appMain = {
  data () {
        
    return {
      cacheKey: 'OPML-FORMATER',
      cacheAttrs: [],
      init: false,
      
      inputOPML: '',
      outputTable: '',

      pingResult: []
    }
  },
  mounted () {
    this.dataLoad()
    this.loadOPML()
    
    this.inited = true
  },
  watch: {
    inputOPML () {
      if (this.inputOPML.trim() === '') {
        return false
      }
      this.parseOPML()
    }
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

    // ----------------------------------------------------------------
    loadOPML () {
      $.get('./data/20220413-1537.opml', (data) => {
        if (typeof(data) === 'string' && data.trim() !== '') {
          this.inputOPML = data
        }
      })
    },
    parseOPML () {
      let xmlObject = $($.parseXML(this.inputOPML.trim()))
      
      let urlToPing = []

      let output = [
        ['cate', 'title', 'originalRSS', 'extendRSS']
      ]
      let catelogs = xmlObject.find('body > outline')
      for (let i = 0; i < catelogs.length; i++) {
        let catelog = catelogs.eq(i)
        let cate = catelog.attr('title').trim()

        catelog.children().each((j, feed) => {
          //console.log(i, feed)
          feed = $(feed)
          let title = feed.attr('title').trim()
          let originalRSS = feed.attr('xmlUrl')
          let extendRSS = ''
          if (originalRSS.startsWith('http://pulipuli.myqnapcloud.com/304/')) {
            
            extendRSS = this.changeCacheTime(originalRSS)
            //if (!extendRSS.startsWith('http')) {
              //console.log(extendRSS, originalRSS)
            //}
            

            urlToPing.push(originalRSS)
            let url = extendRSS.slice(extendRSS.lastIndexOf('/') + 1)
            url = decodeURIComponent(url)

            if (!url.startsWith('http')) {
              console.log(extendRSS, originalRSS, url)
            }
            originalRSS = url
          }

          output.push([cate, title, originalRSS, extendRSS])
        })
      }

      this.outputTable = output.map(line => line.join('\t')).join('\n')

      //console.log(this.inputOPML)
      //console.log(xmlObject.find('[htmlUrl]').length)
      this.ping(urlToPing)
    },
    changeCacheTime (fcURL) {
      if (fcURL.indexOf('/fc/$') === -1 && fcURL.indexOf('/fc/') > -1) {
        //console.log(1)
        let partA = fcURL.slice(0, fcURL.indexOf('/fc/') + 4)
        let partB = fcURL.slice(fcURL.indexOf('/fc/') + 4)
        if (partB.split('/').length > 1) {
          return partA + this.getMMDDHHMM() + ',' + partB
        }
        else {
          return partA + this.getMMDDHHMM() + '/' + partB
        }
      }
      else if (fcURL.indexOf('/f/$') === -1 && fcURL.indexOf('/f/') > -1) {
        //console.log(2)
        let partA = fcURL.slice(0, fcURL.indexOf('/f/') + 3)
        let partB = fcURL.slice(fcURL.indexOf('/f/') + 3)
        if (partB.split('/').length > 1) {
          return partA + this.getMMDDHHMM() + ',' + partB
        }
        else {
          return partA + this.getMMDDHHMM() + '/' + partB
        }
      }
      else if (fcURL.indexOf('/fc/$') > -1) {
        //console.log(3)
        let partA = fcURL.slice(0, fcURL.indexOf('/fc/') + 4)
        let partB = fcURL.slice(fcURL.lastIndexOf('$') + 1)
        if (partB.split('/').length > 1) {
          return partA + this.getMMDDHHMM() + ',' + partB
        }
        else {
          return partA + this.getMMDDHHMM() + '/' + partB
        }
      }
      else if (fcURL.indexOf('/f/$') > -1) {
        //console.log(4)
        let partA = fcURL.slice(0, fcURL.indexOf('/f/') + 3)
        let partB = fcURL.slice(fcURL.lastIndexOf('$') + 1)
        if (partB.split('/').length > 1) {
          return partA + this.getMMDDHHMM() + ',' + partB
        }
        else {
          return partA + this.getMMDDHHMM() + '/' + partB
        }
      }
    },
    getMMDDHHMM () {
      var date = new Date();
      var gg = date.getUTCDate();
      var mm = (date.getUTCMonth() + 1);

      if (gg < 10) {
          gg = "0" + gg;
      }

      if (mm < 10) {
          mm = "0" + mm;
      }

      var cur_day = mm + "" + gg;

      var hours = date.getUTCHours()
      var minutes = date.getUTCMinutes()
      var seconds = date.getUTCSeconds();

      if (hours < 10) {
          hours = "0" + hours;
      }

      if (minutes < 10) {
          minutes = "0" + minutes;
      }

      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      return '$' + cur_day + "-" + hours + "" + minutes + '$'
    },
    ping (urlToPing) {
      this.pingResult = []


      urlToPing.forEach(url => {
        //console.log(url)

        //$.post('https://script.google.com/macros/s/AKfycbxR-XE9EXDekhvIWUAmAZkxgXkxR4Zmw45ZvsFYhtwAaLc8s97M-7dqE2UWHw9klz9F/exec', {
        //  feed: url
        //})
        /*
        axios({
          method: 'post',
          url: 'https://script.google.com/macros/s/AKfycbxR-XE9EXDekhvIWUAmAZkxgXkxR4Zmw45ZvsFYhtwAaLc8s97M-7dqE2UWHw9klz9F/exec',
          data: {
            feed: url
          }
        });
        */
        // Google Sheet
        // https://script.google.com/macros/s/AKfycbxR-XE9EXDekhvIWUAmAZkxgXkxR4Zmw45ZvsFYhtwAaLc8s97M-7dqE2UWHw9klz9F/exec?feed=
        //url = 'https://script.google.com/macros/s/AKfycbxR-XE9EXDekhvIWUAmAZkxgXkxR4Zmw45ZvsFYhtwAaLc8s97M-7dqE2UWHw9klz9F/exec?feed=' 
        //  + url
        //console.log(url)
        /*
        $.ajax({
          url: url,
          type: 'HEAD',
          success: (result) => {
            //console.log('reply');
            this.pingResult.shift({
              url,
              repsonse: 'success'
            }) 
          },     
          error: (result) => {
            //  alert('timeout/error');
            this.pingResult.shift({
              url,
              repsonse: 'error'
            }) 
          }
        })
        */
        let iframe = $(`<div>
          <a href="${url}" target="${url}">${url}</a>
          <br />
          <iframe src="${url}"></iframe>
        </div>`).appendTo('body')
      })
    }
  }
}

module.exports = appMain