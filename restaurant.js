/**
 * Examination1 1dv023
 * Adda Skogberg as224wq
 */

'use strict'

const cheerio = require('cheerio')

// find the booking alternatives for the restaurant. look at what time the films are and find a booking
function restaurantList (html) { // nr1
  let restaurantBookings = []
  let control = cheerio.load(html)
  let findPage = control('input[name=group1]')

  control(findPage).each(function (i, element) {
    restaurantBookings.push(parseBooking(control(element).val()))
  })
  console.log(html + 'är i restaurantList')
  return restaurantBookings
}

console.log(restaurantList)

// analyze the  booking alternatives
// booking alternatives
// find a restaurant booking suitable matching the movies what day and from - to
// find a restaurant to match the film time
