let express = require('express'),
  request = require('request'),
  querystring = require('querystring'),
  dotenv = require('dotenv').config()

let app = express()

let redirect_uri = process.env.REDIRECT_URI || 'http://localhost:8080/callback'

app.get('/login', (req,res) => {
  res.redirect('https://accounts.spotify.com/authorize?' + 
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email',
      redirect_uri
    }))
})

app.get('/callback', (req,res) => {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization code'
    },
    headers: {
      'Authorization': 'Basic ' 
          + (new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SERCRET).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, (err,res,body) => {
    var access_token = body.access_token
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
    res.redirect(uri + '?access_token=' + access_token)
  })
})

let port = process.env.PORT || 8080
console.log(`Listening on port ${port}`)
app.listen(port)