/**
 * HangoutController
 *
 * @description :: Server-side logic for managing hangouts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    index: function (req, res) {

   var http = require("http")

    var url = "https://people.googleapis.com";
        console.log('Url ' + url );

        var options = {
        host: url,
        path: '/v1/people/me/connections?pageSize=100&key=AIzaSyBHvLgQTJ9LvUL_3cnuBgyIwOxTRRZ4viA',
        method: 'GET'
        };

        http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    }).end();

    }
	
};

