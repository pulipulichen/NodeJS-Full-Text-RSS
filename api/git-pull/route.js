
const { exec } = require("child_process");
const path = require('path')

const gitPullComment = `cd ${path.resolve(__dirname, './../../')}; git pull`

const route = function (app) {
  app.get('/git-pull', async (req, res) => {
    try {
      exec(gitPullComment, (error, stdout, stderr) => {
        let message
          if (error) {
            //console.log(`error: ${error.message}`);
            message = `error: ${error.message}`
            //return;
          }
          if (stderr) {
            //console.log(`stderr: ${stderr}`);
            //return;
            message = `stderr: ${stderr}`
          }
          //console.log(`stdout: ${stdout}`);
          message = `stdout: ${stdout}`

          res.send(message)
      });
    //return 'git pull'
    }
    catch (e) {
      res.send(e)
    }
  })
}

module.exports = route