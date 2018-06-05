'use strict'

const request = require('request')

module.exports = {
  fetch: fetch
}

function fetch (url, callback) {
  request(url, function (error, response, html) {
    if (error) {
      return callback(error)
    }
    if (response.statusCode !== 200) {
      return callback(new Error('Bad status code'))
    }
    return callback(null, html)
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
