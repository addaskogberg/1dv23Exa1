'use strict'

const request = require('request')

module.exports = {
  fetch: fetch
}

function fetch (url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, response, html) {
      if (error) {
        return reject(error)
      }
      if (response.statusCode !== 200) {
        return reject(new Error('Bad status code'))
      }
      resolve(html)
    })
  })
}

/* request(url, function (error, response, html) {
  if (error) {
    return console.log(error)
  }
  if (response.statusCode !== 200) {
    return console.log('Error code')
  }
  console.log(html)
}) */
