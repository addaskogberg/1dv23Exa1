/**
 * Examination1 1dv023
 * Adda Skogberg as224wq
 */

'use strict'
var calendar = require('./calendar')
const cinema = require('./cinema')
const restaurant = require('./restaurant')
const request = require('request-promise')

var url = process.argv[2] || 'http://labcloudftk46.lnu.se:8080/cinema2'
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
  return calendar.getLinks(url)
}).then(function (links) {
  calendarURL = links[0]
  cinemaURL = links[1]
  restaurantURL = links[2]
 // console.log(restaurantURL)

    // persons calendarurl
  return calendar.getLinks(calendarURL)
}).then(function (links) { // calling function getlinks calendar status by day
  return calendar.calendars(links)
}).then(function (friends) {
  let commonDates = calendar.dayForDate(friends)// what films can they watch together
  return cinema.cinemaFilms(cinemaURL, commonDates)
}).then(function (movies) {
  return restaurant.bookingSlots(restaurantURL, movies)// when can we have dinner
}).then(function (bookings) {
  printingToTerminal(bookings)
}).catch(function (error) {
  console.log(error)
  process.exit()
})

function printingToTerminal (posting) {
  // console.log(posting)
  for (let i = 0; i < posting.length; i += 1) {
    console.log('Option ' + (i + 1) + ':')
    console.log('On ' + posting[i].day + ', there is a free table between ' + posting[i].table.from +
    ' and ' + posting[i].table.to + ' after you have seen ' + posting[i].movie.title + ' which starts at ' + posting[i].movie.startTime)
    console.log(' ')
  }
}
