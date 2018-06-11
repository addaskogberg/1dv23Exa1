/**
 * Examination1 1dv023
 * Adda Skogberg as224wq
 */

'use strict'
var calendar = require('./calendar')
const cinema = require('./cinema')
const restaurant = require('./restaurant')
const request = require('request-promise')

var url = process.argv[2] || 'http://vhost3.lnu.se:20080/calendar/'
let calendarURL
let cinemaURL
let restaurantURL

function isHTTP (url) {
  return new Promise(function (resolve, reject, error) {
    if (url.substr(0, 4) !== 'http') {
      reject(error, 'werong protocol')
    }

    request(url).then(function () {
      // console.log('skriver kollar HTTP')
      resolve()
    }).catch(function (error) {
      reject(error)
    })
  })
}

isHTTP(url).then(function () {
    // url from first page
  return calendar.getLinks(url)
}).then(function (links) {
  calendarURL = links[0]
  cinemaURL = links[1]
  restaurantURL = links[2]

    // persons calendarurl
  return calendar.getLinks(calendarURL)
}).then(function (links) {
    // calling function getlinks calendar status by day
  return calendar.calendars(links)
}).then(function (friends) {
     // what films can they watch together
  let commonDates = calendar.dayForDate(friends)
  return cinema.cinemaFilms(cinemaURL, commonDates)
}).then(function (movies) {
// when can we have dinner
  return restaurant.bookingSlots(restaurantURL, movies)
}).then(function (bookings) {
    // Print options
  printingToTerminal(bookings)
  process.exit()
}).catch(function (error) {
  console.log(error)
  process.exit()
})

function printingToTerminal (posting) {
  for (let i = 0; i < posting.length; i += 1) {
    console.log('Option: ' + (i + 1))
    console.log('Movie: ' + posting[i].movie.title)
  }
}
