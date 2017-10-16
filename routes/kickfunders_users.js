var express = require('express');
var router = express.Router();
var SECRET = require('../SECRET');
var fetch = require('node-fetch');
var jwt = require('jsonwebtoken');

const now = Date.now();
const exp = (now/1000) + 3600;
const baseUrl = 'https://www.googleapis.com/';

const aud = `${baseUrl}oauth2/v4/token`;
const iss = SECRET.client_email;
const scope = `${baseUrl}auth/admin.directory.user ${baseUrl}auth/admin.directory.user.readonly`;
const sub = SECRET.DOMAIN_ADMIN_EMAIL; // Atleast a user that has an admin access/privilege

const jwtArgs = { iss, scope, aud, exp, sub };

router.post('/', function(req, res, next) {
  const assertion = jwt.sign(jwtArgs, SECRET.cert, { algorithm: 'RS256'});
  const grant_type = 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer';
  const body = `${grant_type}&assertion=${assertion}`;
  fetch(`${baseUrl}oauth2/v4/token`, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/x-www-form-urlencoded',
    },
    body,
  })
  .then((res) => res.json() )
  .then((json)=> {
    fetch(`${baseUrl}admin/directory/v1/users?domain=${SECRET.DOMAIN_NAME_TO_QUERY}
`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + json.access_token,
      },
    })
    .then((res) => {
      return res.json()
    } )
    .then((_json)=> {
      const users = _json.users.map(user => ({ id: user.id, email: user.primaryEmail, name: user.name.fullName }))
      res.render('google_plus_read', { users })
    })
    .catch(err => res.send(err))
  })
});

module.exports = router;
