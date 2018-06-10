/**
 * Examination1 1dv023
 * Adda Skogberg as224wq
 */

'use strict'
var calendar = require('./calendar')

const request = require('request-promise')

var url = process.argv[2] || 'http://vhost3.lnu.se:20080/calendar/'
let calendarURL

function validate (url) {
  return new Promise(function (resolve, reject, error) {
    if (url.substr(0, 4) !== 'http') {
      reject(error, 'werong protocol')
    }

    request(url).then(function () {
      console.log('skriver ut i validate')
      resolve()
    }).catch(function (error) {
      reject(error)
    })
  })
}

validate(url).then(function () {
    // url from first page
  return calendar.getLinks(url)
}).then(function (links) {
  calendarURL = links[0]
    // persons calendarurl
  return calendar.getLinks(calendarURL)
}).then(function (links) {
    // calling get links function
  return calendar.calendars(links)
})
