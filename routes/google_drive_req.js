var express = require('express');
var router = express.Router();
var SECRET = require('../SECRET');
var fetch = require('node-fetch');
var jwt = require('jsonwebtoken');

const now = Date.now();
const exp = (now/1000) + 3600;
const aud = "https://www.googleapis.com/oauth2/v4/token";

const jwtParams = {
  "iss": SECRET.client_email,
  "scope": 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/plus.stream.read',
  aud,
  exp,
};

router.post('/', function(req, res, next) {
  const assertion = jwt.sign(jwtParams, SECRET.cert, { algorithm: 'RS256'});
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
    fetch(`https://www.googleapis.com/drive/v2/files?access_token=${json.access_token}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + json.access_token,
      },
    })
    .then((res) => {
      return res.json()
    } )
    .then((_json)=> {
      const list = _json.items.map((file) => `<li><img src=${file.iconLink.replace('16', '128')}><h3>${file.title}</h3><a href=${file.embedLink}></li>`);
      list.length ? res.send(`<ul>${list}</ul>`) : res.send('Nothing to Render here...')

    })
    .catch(err => res.send(err))
  })
});

module.exports = router;
