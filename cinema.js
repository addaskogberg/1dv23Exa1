'use strict'
const request = require('request')
const JSDOM = require('jsdom').JSDOM

// console.log(process.argv)
let args = process.argv.slice(2)

if (args.length === 0) {
  console.log('ERROR: No arguments provided e.g "npm start <url>"')
  process.exit(0)
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

function parseHTML (html) {
  const dom = new JSDOM(html)
  return Array.from(dom.window.document.querySelectorAll('a'))
}
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
