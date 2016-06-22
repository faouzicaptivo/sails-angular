/**
 * HangoutController
 *
 * @description :: Server-side logic for managing hangouts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    index: function (req, res) {

//    var request = require("request")

//     var url = "https://people.googleapis.com/v1/people/me/connections?pageSize=100&" +
//         "key=AIzaSyBHvLgQTJ9LvUL_3cnuBgyIwOxTRRZ4viA";
//         console.log('Url' + url );

//         var request = require('request');
//         request(url, function (error, response, body) {
//             console.log( body );
//         })

    var google = require('googleapis');
    var plus = google.plus('v1');
    var OAuth2 = google.auth.OAuth2;
    var oauth2Client = new OAuth2(
        "110981261754-uqvjjs328a5kbb8mvkqfoqas85el14pm.apps.googleusercontent.com",
        "0dyLlg8EsMKpNfw1TM5mT4KT",
        "http://localhost:1337/auth/google/callback");

    // Retrieve tokens via token exchange explained above or set them:
    oauth2Client.getToken(code, function(err, tokens) {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    if(!err) {
        oauth2Client.setCredentials(tokens);
    }
    });

    console.log(oauth2Client);
    plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
        console.log(err);
    });

    }
	
};

