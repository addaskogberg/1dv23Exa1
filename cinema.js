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

function asyncRequest (url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, response, body) {
      if (error) {
        reject(error)
      }
      resolve(body)
    })
  })
}
