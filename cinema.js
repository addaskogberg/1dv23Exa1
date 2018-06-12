/**
 * Examination1 1dv023
 * Adda Skogberg as224wq
 */

'use strict'
const request = require('request-promise')
const cheerio = require('cheerio')

module.exports = {
  cinemaFilms: cinemaFilms
}

/**
 * checks the films id and title
 *
 * @param {any} html
 * @returns movie id and movie title
 */
function findMovieElements (html) {
  let values = []
  let control = cheerio.load(html)

  let film = control('select[name=movie]').html()
  control = cheerio.load(film)

  control('option[value]').each(function (i, element) {
    values.push({
      id: control(element).val(),
      title: control(element).text()
    })
  })

  return values
}

/**
 *
 * What film is on at what time
 *
 * @param {any} url
 * @param {any} date
 * @param {any} item
 * @param {any} films
 * @returns  promise
 */
function whatFilmIsOn (url, date, item, films) {
  url = url + '/check?day=' + date + '&movie=' + item.id

  return new Promise(function (resolve, reject) {
    let content = {
      url: url
    }

    request(content).then(function (json) {
      let Films = JSON.parse(json)

      Films.forEach(function (film) {
        film.time = film.time.substr(0, 2)
        film.title = item.title
        films.push(film)
       // console.log(film.time + 'skriver ut i what film is on')
      })

      resolve()
    }).catch(function (error) {
      reject(error)
    })
  })
}

/**
 * what films are available on the dates all can go
 *
 * @param {any} url
 * @param {any} dates
 * @returns
 */
// console.log(data)
function cinemaFilms (url, dates) { // 3
  return new Promise(function (resolve, reject, error) {
    let films = []
    let movieAlternatives = {
      url: url
    }

    request(movieAlternatives).then(function (html) {
      return findMovieElements(html)
    }).then(function (items) {
      if (dates.length < 1) {
        reject(error, 'Could not find a day')
      }

      let moviePromises = []

      dates.forEach(function (date) {
        items.forEach(function (items) {
          moviePromises.push(whatFilmIsOn(url, date, items, films))
        })
      })

      Promise.all(moviePromises).then(function () {
        let presentFilms = []

        films.forEach(function (film) {
          if (film.status === 1) {
            presentFilms.push(film)
          //  console.log(film.title + 'är i cinama films')
          }
        })

        if (presentFilms.length < 1) {
          reject(error, 'Nothing is  available')
        } else {
          resolve(presentFilms)
        }
      }).catch(function (error) {
        reject(error)
      })
    })
  })
}
