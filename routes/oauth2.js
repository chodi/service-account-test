var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
const secret = require('../SECRET');

var YOUR_CLIENT_ID = secret.YOUR_CLIENT_ID;
var YOUR_CLIENT_SECRET = secret.YOUR_CLIENT_SECRET;
var YOUR_REDIRECT_URL = secret.YOUR_REDIRECT_URL;


var oauth2Client = new OAuth2(
  YOUR_CLIENT_ID,
  YOUR_CLIENT_SECRET,
  YOUR_REDIRECT_URL
);


var scopes = ['https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/admin.directory.user',
  'https://www.googleapis.com/auth/admin.directory.user.readonly',
];

var generateAuthUrl = (params) => oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
  // approval_prompt : 'force',

  // If you only need one scope you can pass it as a string
  scope: scopes,
  state: params,
});

module.exports = {
  generateAuthUrl,
  oauth2Client,
  scopes,
};