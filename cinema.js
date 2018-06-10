/**
 * Examination1 1dv023
 * Adda Skogberg as224wq
 */

'use strict'
const request = require('request-promise')
const cheerio = require('cheerio')

console.log(process.argv)
let args = process.argv.slice(2)

if (args.length === 0) {
  console.log('ERROR: No arguments provided e.g "npm start <url>"')
  process.exit(0)
}

/**
 * checks what movies are available
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
        console.log(film.time + 'skriver ut i what film is on')
      })

      resolve()
    }).catch(function (error) {
      reject(error)
    })
  })
}

const startURL = args[0]
console.log(startURL)

async function start (url) {
  let data = await asyncRequest(url)
  // console.log(data)
  return data
}

let data = start(startURL)
data.then(function (html) {
  let links = parseHTML(html)
  links = links.map(alinks => alinks.href)
  if (links.length < 1) {
    throw new Error('could not find any links')
  }
  console.log(links)
}).catch(function (error) {
  console.log(error.message)
})

// console.log(data)
