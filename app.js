/**
 * Examination1 1dv023
 * Adda Skogberg as224wq
 */

'use strict'
// var cinema = require('./cinema')
var calendar = require('./calendar')

const request = require('request-promise')

var url = process.argv[2] || 'http://vhost3.lnu.se:20080/calendar/'
let calendarURL

function validate (url) {
  return new Promise(function (resolve, reject) {
    if (url.substr(0, 4) !== 'http') {
     // reject(error)
    }

    request(url).then(function () {
      resolve()
    }).catch(function (error) {
      reject(error)
    })
  })
}

validate(url).then(function () {
    // Get links to calendar, cinema, and restaurant from the front page
  return calendar.getLinks(url)
}).then(function (links) {
    // Store links to global variables
  calendarURL = links[0]

    // Get links to the calendar page of each person
  return calendar.getLinks(calendarURL)
}).then(function (links) {
    // Get all friends and their what their status is on each day
  return calendar.calendars(links)
})
