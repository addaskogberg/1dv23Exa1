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

/**
 * Takes the html and looks for what data is in the element
 *
 * @param {any} html
 * @returns
 */
function restaurantList (html) {
  let restaurantBookings = []
  let control = cheerio.load(html)
  let findPage = control('input[name=group1]')
  control(findPage).each(function (i, element) {
    restaurantBookings.push(convertString(control(element).val()))
    // console.log(convertString(control(element).val()))
  })

  return restaurantBookings
}

/**
 *  changes booking alternativs to comparable identifiers
 *
 * @param {any} str
 * @returns string of number 05 06 or 07
 */

function convertString (str) { // nr2
  let day = str.substr(0, 3)
  let from = str.substr(3, 2)
  let to = str.substr(5, 2)

  if (day === 'fri') {
    day = '05'
  } if (day === 'sat') {
    day = '06'
  } if (day === 'sun') {
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

/**
 * // log on to the restaurant booking
 *
 * @param {any} url
 * @returns object
 */
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
 * @param {any} url
 * @param {any} movies
 * @returns
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
 * When to eat
 *
 * @param {any} bookings
 * @param {any} movies
 * @returns object
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
        } if (movie.day === '06') {
          dateDay = 'Saturday'
        } if (movie.day === '07') {
          dateDay = 'Sunday'
        }
        options.push({
          day: dateDay,
          movie: {
            title: movie.title,
            startTime: movie.time
          },
          table: {
            from: booking.from + ':00',
            to: booking.to + ':00'
          }
        })
      }
    })
  })

  return options
}
