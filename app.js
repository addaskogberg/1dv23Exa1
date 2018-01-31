/*
*Check which day or days all friends are available; if none - output this on screen
*Get the available movies for that day(s)
*Login to the restaurant web site and get the content
*See when the three friends can eat. Think that they want to book a table minimum two hours after the movie starts.
*Present the solution(s) as output in your terminal/console window (or as a HTML view)
**[Optional] - Use the form for a user to book a table with your application
*/
'use strict'
const request = require('request')

var url = process.argv[2] || 'http://vhost3.lnu.se:20080/calendar/'

request(url, function (error, response, html) {
  if (error) {
    return console.log(error)
  }
  if (response.statusCode !== 200) {
    return console.log('Error code')
  }
  console.log(html)
})
