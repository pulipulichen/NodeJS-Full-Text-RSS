const cheerio = require('cheerio')
const e = require('express')
const ImgbbUpload = require('./../../../lib/image/ImgbbUpload.js')
const IsURL = require('./../../../lib/stringUtils/IsURL.js')

const DelazyLoadingImg = async function (html, url) {
  //console.log(html)
  
  let $
  if (typeof(html) === 'object' || typeof(html) === 'function') {
    $ = html
  }
  else {
    $ = cheerio.load('<div>' + html + '</div>'); // 載入 body
  }
  
  // -------------------
  
  let imgList = $(`img[src$=".tmp"][data-original]`)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    img.attr('src', img.attr('data-original'))
    img.removeAttr('srcset')
  }
  
  // -------------------
  
  imgList = $(`img[src$="loading.gif"][data-original]`)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    img.attr('src', img.attr('data-original'))
    img.removeAttr('srcset')
  }
  
  // -------------------
  
  imgList = $(`img.lazyload[data-src]`)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    img.attr('src', img.attr('data-src'))
    img.removeAttr('srcset')
  }
  
  // -------------------
  
  imgList = $(`img.lazy[data-src]`)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    img.attr('src', img.attr('data-src'))
    img.removeAttr('srcset')
  }
  
  
  // -------------------
  
  imgList = $(`img[src$="/loading.svg"][data-src]`)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    let src = img.attr('data-src')
    if (src.startsWith('/')) {
      let urlObject = new URL(url)
      src = urlObject.origin + src
    }
    img.attr('src', src)
    img.removeAttr('srcset')
  }
  
  // -------------------
  // 20211130-0007 
  
  /*
  imgList = $(`img[src^="data:image/svg+xml,"][data-lazy-src][data-orig-file]`)
  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    let src = img.attr('data-orig-file')
    if (src.startsWith('/')) {
      let urlObject = new URL(url)
      src = urlObject.origin + src
    }
    img.attr('src', src)
    img.removeAttr('srcset')
  }
  */
  
  let figures = $(`figure.wp-block-image`)
  for (let i = 0; i < figures.length; i++) {
    let figure = figures.eq(i)
    let noscript = figure.children('noscript')
    figure.after(noscript.text())
    figure.remove()
  }
  
  // -------------------
  // 20220108-0007 
  
  await delazy20220101($)
  await delazy20220115($)
  await delazy20220117($)
  

  // ------------------------------
  
  return $
}

const delazy20220101 = async function ($) {
  let imgList = $('img[data-orig-file][data-permalink][data-attachment-id][style="display:none;visibility:hidden;"]')
  for (let i = 0; i < imgList.length; i++) {
    
    let imgEle = imgList.eq(i)
    imgEle.removeAttr('style')

    let origFile = imgEle.attr('data-orig-file')
    if (typeof(origFile) === 'string' && IsURL(origFile)) {
      let imgurlFile = await ImgbbUpload(origFile)
      if (imgurlFile) {
        imgEle.attr('src', imgurlFile)
      }
      else {
        imgEle.attr('src', origFile)
      }
    }
    
    let figure = imgList.eq(i)
    let noscript = figure.next('noscript')

    let prevEle = figure.prev()
    let parent = figure.parent()
    if (parent.prop('tagName').toLowerCase() === 'picture'
            && prevEle.prop('tagName').toLowerCase() === 'source') {
      prevEle.remove()
    }

    imgEle = $(noscript.text())
    imgEle.removeAttr('srcset')
    let src = imgEle.attr('src')

    if (src.startsWith('https://www.inote.tw/') && src.indexOf('/wp-content/') > -1) {
      let uploadsURI = src.slice(src.indexOf('/wp-content/'))
      let i2URL = `https://i2.wp.com/www.inote.tw${uploadsURI}?resize=640%2C279&ssl=1`
      imgEle.attr('src', i2URL)
    }

    figure.after(imgEle)
    figure.remove()
    noscript.remove()
  }

  let imgList2 = $('img[data-orig-file][data-permalink][data-attachment-id]')
  for (let i = 0; i < imgList2.length; i++) {
    
    let imgEle = imgList.eq(i)
    imgEle.removeAttr('style')

    let origFile = imgEle.attr('data-orig-file')
    if (typeof(origFile) === 'string' && IsURL(origFile)) {
      let imgurlFile = await ImgbbUpload(origFile)
      if (imgurlFile) {
        imgEle.attr('src', imgurlFile)
      }
      else {
        imgEle.attr('src', origFile)
      }
    }
    
    let figure = imgList2.eq(i)
    let noscript = figure.next('noscript')

    //let imgEle
    if (noscript.length > 1) {
      imgEle = $(noscript.text())
    }
    else {
      imgEle = figure
    }
    
    imgEle.removeAttr('srcset')
    let src = imgEle.attr('src')

    if (src.startsWith('https://www.inote.tw/') && src.indexOf('/wp-content/') > -1) {
      let uploadsURI = src.slice(src.indexOf('/wp-content/'))
      let i2URL = `https://i2.wp.com/www.inote.tw${uploadsURI}?resize=640%2C279&ssl=1`
      imgEle.attr('src', i2URL)
    }

    if (noscript.length > 1) {
      figure.after(imgEle)
      figure.remove()
      noscript.remove()
    }
  }

  $('img[srcset]').removeAttr('srcset')

  // https://www.inote.tw/wp-content/uploads/2020/02/mp3DirectCut.jpg
  // https://i2.wp.com/www.inote.tw/wp-content/uploads/2017/08/notepad-plus-plus-3.jpg?resize=640%2C279&ssl=1
  // https://i2.wp.com/www.inote.tw/wp-content/uploads/2020/02/mp3DirectCut.jpg?resize=640%2C279&ssl=1
}


const delazy20220115 = async function ($) {
  let imgList = $('img[data-cfsrc][loading="lazy"]')
  imgList.css('display', '')
  imgList.css('visibility', '')

  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    img.attr('src', img.attr('data-cfsrc'))
    img.removeAttr('data-cfsrc')
    img.removeAttr('loading')
    img.removeAttr('sizes')

    let next = img.next()
    if (next.prop('tagName').toLowerCase() === 'noscript') {
      next.remove()
    }
  }

  // https://www.inote.tw/wp-content/uploads/2020/02/mp3DirectCut.jpg
  // https://i2.wp.com/www.inote.tw/wp-content/uploads/2017/08/notepad-plus-plus-3.jpg?resize=640%2C279&ssl=1
  // https://i2.wp.com/www.inote.tw/wp-content/uploads/2020/02/mp3DirectCut.jpg?resize=640%2C279&ssl=1
}

const delazy20220117 = async function ($) {
  let imgList = $('img[data-lazy-src]')

  for (let i = 0; i < imgList.length; i++) {
    let img = imgList.eq(i)
    img.attr('src', img.attr('data-lazy-src'))

    let next = img.next()
    if (next.length > 0) {
      try {
        if (next.prop('tagName').toLowerCase() === 'noscript') {
          next.remove()
        }
        else if (next.prop('tagName').toLowerCase() === 'img') {
          // https://i0.wp.com/www.inote.tw/wp-content/uploads/2022/01/中原素麵食_18.jpg?fit=1200%2C900&ssl=1
          // https://i0.wp.com/www.inote.tw/wp-content/uploads/2022/01/中原素麵食_18.jpg?fit=1200%2C900&ssl=1
          if (img.attr('data-orig-file') === next.attr('data-orig-file')) {
            next.remove()
          }
        }
      }
      catch (e) {
        console.error(e)
      }
    }
  }

  // https://www.inote.tw/wp-content/uploads/2020/02/mp3DirectCut.jpg
  // https://i2.wp.com/www.inote.tw/wp-content/uploads/2017/08/notepad-plus-plus-3.jpg?resize=640%2C279&ssl=1
  // https://i2.wp.com/www.inote.tw/wp-content/uploads/2020/02/mp3DirectCut.jpg?resize=640%2C279&ssl=1
}

module.exports = DelazyLoadingImg
