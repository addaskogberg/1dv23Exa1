/**
 * Examination1 1dv023
 * Adda Skogberg as224wq
 */

'use strict'

const cheerio = require('cheerio')

module.exports = {
  matchingMovieAndRestaruant: matchingMovieAndRestaruant
}

// find the booking alternatives for the restaurant. look at what time the films are and find a booking

// analyze the  booking alternatives
function restaurantList (html) {
  let restaurantBookings = []
  let control = cheerio.load(html)
  let findPage = control('input[name=group1]')

  control(findPage).each(function (i, element) {
    restaurantBookings.push(convertString(control(element).val()))
  })
  console.log(html + 'är i restaurantList')
  return restaurantBookings
}

console.log(restaurantList + 'skriver ut restauranglista')

// changes booking alternativs to comparable identifiers

function convertString (str) { // nr2
  let day = str.substr(0, 3)
  let from = str.substr(3, 2)
  let to = str.substr(5, 2)

  if (day === 'fri') {
    day = '05'
  } else if (day === 'sat') {
    day = '06'
  } else if (day === 'sun') {
    day = '07'
  }

  return {
    day: day,
    from: from,
    to: to,
    value: str
  }
}

/**
 * what restaurant bookings are free after the movie
 *
 */

/**
 *
 *
 */
function matchingMovieAndRestaruant () {
  console.log(' hitta en matchande film')
}
