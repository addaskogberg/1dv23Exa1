/**
 * Examination1 1dv023
 * Adda Skogberg as224wq
 */

'use strict'
var cherrio = require('cheerio')
var fs = require('fs')
var url = process.argv[2] || 'http://vhost3.lnu.se:20080/calendar/'
var cinema = require('./cinema')
var calendar = require('./calendar')

console.log(cinema)

calendar.fetch(url, function (error, data) {
  if (error) {
    return console.log(error)
  }
  var ul = cherrio.load(data)('ul').text().trim()
  fs.appendFile('./dumpUl.txt', ul + '\n-------\n', function (error) {
    if (error) {
      return console.log('error writing file')
    }
    console.log('written to file')
    console.log(calendar.fetch())
  })
})
