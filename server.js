let express = require('express'),
  routes = require('./routes'),
  request = require('request')
  querystring = require('querystring'),
  dotenv = require('dotenv').config(),
  redirect_uri = process.env.REDIRECT_URI || 'http://localhost:8080/callback'

let app = express()
routes(app ,request)

let port = process.env.PORT || 8080
console.log(`Listening on port ${port}`)
app.listen(port)