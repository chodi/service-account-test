var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var jwt = require('jsonwebtoken');
var SECRET = require('../SECRET');

const now = Date.now();
const exp = (now/1000) + 3600;
const aud = "https://www.googleapis.com/oauth2/v4/token";

const jwtArgs = {
  "iss": SECRET.client_email,
  "scope": 'https://www.googleapis.com/auth/urlshortener',
  aud,
  exp,
};

router.post('/', function(req, res, next) {
  const longUrl = req.body.url;
  const assertion = jwt.sign(jwtArgs, SECRET.cert, { algorithm: 'RS256'});
  const grant_type = 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer';
  const body = `${grant_type}&assertion=${assertion}`;
  fetch(`https://www.googleapis.com/oauth2/v4/token`, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/x-www-form-urlencoded',
    },
    body,
  })
  .then((res) => res.json() )
  .then((json)=> {
    fetch(`https://www.googleapis.com/urlshortener/v1/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + json.access_token,
      },
      body: JSON.stringify({
        longUrl,
      })
    })
    .then((res) => res.json() )
    .then((_json)=> {
      res.send(`Here's the link of <a href="${_json.id}">${_json.longUrl}</a>:<br/>${_json.id}`)
    })
  })
});

module.exports = router;
