/**
 * Examination1 1dv023
 * Adda Skogberg as224wq
 */

'use strict'

const cheerio = require('cheerio')
const request = require('request-promise')

module.exports = {
  bookingSlots: bookingSlots
}

// find the booking alternatives for the restaurant. look at what time the films are and find a booking

/**
 * Takes the html and looks for
 *
 * @param {any} html
 * @returns
 */
function restaurantList (html) {
  let restaurantBookings = []
  let control = cheerio.load(html)
  let findPage = control('input[name=group1]')
  // console.log(control + 'skriver control')
  control(findPage).each(function (i, element) {
    restaurantBookings.push(convertString(control(element).val()))
    // console.log(control + 'skriver control')
  })
 // console.log(restaurantBookings + 'är i restaurantList')

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

let jar = request.jar()
// log on to the restaurant booking
function login (url) {
  let options = {
    url: url + '/login',
    jar: jar,
    followAllRedirects: true,
    resolveWithFullResponse: true,
    form: {username: 'zeke', password: 'coys'}
  }

  return request.post(options)
}

/**
 * what restaurant bookings are free after the movie
 *
 */
function bookingSlots (url, movies) {
  return new Promise(function (resolve, reject, error) {
    login(url).then(function (response) {
      let html = response.body
      let resturantSlot = restaurantList(html)
      let bookings = matchingMovieAndRestaruant(resturantSlot, movies)

      if (bookings.length < 1) {
        reject(error, 'No booking available')
      } else {
        resolve(bookings)
      }
    }).catch(function (error) {
      reject(error)
    })
  })
}

/**
 *
 *
 * @param {any} bookings
 * @param {any} movies
 * @returns
 */

function matchingMovieAndRestaruant (bookings, movies) {
  let options = []

  movies.forEach(function (movie) {
    bookings.forEach(function (booking) {
      let movieEndTime = String(Number(movie.time) + 2)
      if (movie.day === booking.day && movieEndTime === booking.from) {
        let dateDay = ''
        if (movie.day === '05') {
          dateDay = 'Friday'
        } else if (movie.day === '06') {
          dateDay = 'Saturday'
        } else if (movie.day === '07') {
          dateDay = 'Sunday'
        }
             // console.log('är i cinema' + movie.time)

        options.push({
                 // dayId: movie.day,
          day: dateDay,
          movie: {
                     // id: movie.movie,
            title: movie.title,
            startTime: movie.time
          },
          table: {
                     // id: booking.value,
            from: booking.from + ':00',
            to: booking.to + ':00'
          }
        })
      }
    })
  })

  return options
}
