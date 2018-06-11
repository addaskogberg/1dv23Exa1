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
      console.log('skriver kollar HTTP')
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
    // calling get links function
  return calendar.calendars(links)
}).then(function (friends) {
  // what films can they watch together
  let commonDates = calendar.dayForDate(friends)
  return cinema.cinemaFilms(cinemaURL, commonDates)
}).then(function (movies) {
  // when can we have dinner
  console.log(restaurant.matchingMovieAndRestaruant(restaurantURL, movies))
  return restaurant.matchingMovieAndRestaruant(restaurantURL, movies)
}).catch(function (error) {
  console.log(error + ' kastar fel')
  process.exit()
})
