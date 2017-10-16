var express = require('express');
var router = express.Router();
var app = express()
var oauth2 = require('./oauth2');
const url = require('url');

router.get('/', (req, res, next) => {
  const code = req.query.code;
  oauth2.oauth2Client.getToken(code, function(err, token) {
    if (err) {
      console.log('Error while trying to retrieve access token', err);
      return;
    }
    oauth2.oauth2Client.credentials = token;
    const query = token;
    res.redirect('/');
  });
});

module.exports = router;
