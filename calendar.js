/**
 * Examination1 1dv023
 * Adda Skogberg as224wq
 */

'use strict'
const request = require('request-promise')
const cheerio = require('cheerio')

module.exports = {
  calendars: calendars,
  dayForDate: dayForDate,
  getLinks: getLinks
}

/**
 * Getting the links from the website
 *
 * @param {any} url
 * @returns  a promise
 */
function getLinks (url) {
  return new Promise(function (resolve, reject) {
    let options = {
      url: url
    }

    request(options).then(function (html) {
      let find = cheerio.load(html)
      let paths = []
      let path

      find('a').each(function (i, tag) {
        path = find(tag).attr('href')
        if (!path.startsWith('http')) {
          path = 'http://' + url.split('/')[2] + '/' + url.split('/')[3] + '/' + path
        }
        paths.push(path)
      })

      // console.log(paths + ' utskrift från calendar för att testa links')

      resolve(paths)
    }).catch(function (error) {
      reject(error)
    })
  })
}

/**
Gets the links in the calendar ie paul's, peter's amd , mary's
*/
function calendars (urls) {
  return new Promise(function (resolve, reject) {
    let calendarUrl = []
    let newCalendarUrl = []

    urls.forEach(function (url) {
      calendarUrl.push(findInCalendar(url, newCalendarUrl))
    })

    Promise.all(calendarUrl).then(function () {
      console.log(urls + 'skriver ut länk till kalendrar')
      resolve(newCalendarUrl)
    }).catch(function (error) {
      reject(error)
    })
  })
}

/**
 * Checkes What day are not ok/OK
 *
 * @param {any} url
 * @param {any} friends
 * @returns true or false
 */
function findInCalendar (url, friends) {
  return new Promise(function (resolve, reject) {
    let days = {
      url: url
    }

    request(days).then(function (html) {
      const control = cheerio.load(html)
      let element = control('td')

      let friday = control(element).first().text()
      let saturday = control(element).first().next().text()
      let sunday = control(element).first().next().next().text()

      let person = {
        name: control('h2').text(),
        friday: friday !== '--' && friday !== '-',
        saturday: saturday !== '--' && saturday !== '-',
        sunday: sunday !== '--' && sunday !== '-'
      }

      console.log(person.friday + 'skriver ut friends')
      friends.push(person)
      resolve()
    }).catch(function (error) {
      reject(error)
    })
  })
}

/**
 * checks what day number is available in everyones calendar
 *
 * @param {any} friends
 * @returns the dateday
 */
function dayForDate (friends) {
  let dateday = []

  let friday, saturday, sunday

  friends.forEach(function (person) {
    friday = person.friday
    saturday = person.saturday
    sunday = person.sunday
  })

  if (friday) {
    dateday.push('05')
  } else if (saturday) {
    dateday.push('06')
  } else if (sunday) {
    dateday.push('07')
  }

  return dateday
}
