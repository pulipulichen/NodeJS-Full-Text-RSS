const { exec } = require("child_process")

module.exports = function (videoID) {
  return new Promise((resolve, reject) => {
    let cmd = 'yo' + 'utu' + 'be-dl --list-subs https://www.yo' + 'utu' + 'be.com/watch?v=' + videoID

    exec(cmd, (err, stdout, stderr) => {
      let lines = stdout.split('\n')
      let langs = []

      let nextIsLang = false
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i]

        if (line.startsWith('Language') && line.endsWith('formats')) {
          nextIsLang = true
          continue
        }

        if (nextIsLang) {
          let parts = line.split(' ')
          let lang = parts[0].trim()

          langs.push(lang)
        }
      }

      return resolve(langs)
    })
  })
}