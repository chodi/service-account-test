var express = require('express');
var router = express.Router();
var oauth2 = require ('./oauth2');

router.get('/', function(req, res, next) {
  const generateAuthUrl =  oauth2.generateAuthUrl();
  res.redirect(generateAuthUrl);
});

module.exports = router;
