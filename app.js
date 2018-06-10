/**
 * Examination1 1dv023
 * Adda Skogberg as224wq
 */

'use strict'
var cherrio = require('cheerio')

var cinema = require('./cinema')
var calendar = require('./calendar')

const request = require('request-promise')

var url = process.argv[2] || 'http://vhost3.lnu.se:20080/calendar/'
var calendarURL
var cinemaURL
var restaurantURL

/**
 * has the url http
 *
 * @param {any} url
 * @returns
 */
function checkUrl (url) {
  return new Promise(function (resolve, reject) {
    if (url.substr(0, 4) !== 'http') {
      reject(error)
    }

    request(url).then(function () {
      resolve()
    }).catch(function (error) {
      reject(error)
    })
  })
}

checkUrl.url(url).then(function () {
  // Get links to calendar, cinema, and restaurant from the front page
  return calendar.getLinks(url)
}).then(function (links) {
  // Store links to global variables
  calendarURL = links[0]
  cinemaURL = links[1]
  restaurantURL = links[2]

  console.log(cinema)
})
