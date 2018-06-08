'use strict'
const request = require('request-promise')
const cheerio = require('cheerio')

module.exports = {
  findURL: findURL
}

/**
 * Getting the links from the website
 *
 * @param {any} url
 * @returns  a promise
 */
function findURL (url) {
  return new Promise(function (resolve, reject) {
    let options = {
      url: url
    }

    request(options).then(function (html) {
      let find = cheerio.load(html)
      let URL = []
      let URLS

      find('a').each(function (i, tag) {
        URL = find(tag).attr('href')

        if (!URL.startsWith('http')) {
          URL = 'http://' + url.split('/')[2] + '/' + url.split('/')[3] + '/' + URL
        }
        URLS.push(URL)
      })

      console.log(URLS + ' utskrift från calendar för att testa links')
      resolve(URLS)
    }).catch(function (error) {
      reject(error)
    })
  })
}
