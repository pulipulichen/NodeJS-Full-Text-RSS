/* global __dirname */

// Restart every 27 hour
const timeToRestart = 27 * 60 * 60 * 1000

const path = require('path')
const restartTrigger = path.resolve(__dirname, './restart-trigger.json')
const fs = require('fs')

const DoRestart = function () {
  let content = JSON.stringify({
    date: (new Date()).getTime()
  })
  
  console.log('Try to restart...')
  fs.writeFile(restartTrigger, content, () => {
    console.log('reserted')
  })
}

const AutoRestart = function () {
  setTimeout(() => {
    DoRestart()
  }, timeToRestart)
  
//  let i = 0
//  setInterval(() => {
//    i++
//    console.log('AutoRestart', i)
//  }, 1000)
}

module.exports = AutoRestart