var passport = require('passport')
    , GitHubStrategy = require('passport-github').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    , TwitterStrategy = require('passport-twitter').Strategy;


var verifyHandler = function(token, tokenSecret, profile, done) {
  process.nextTick(function() {

    var google = require('googleapis');

    var people = google.people('v1');
    var OAuth2 = google.auth.OAuth2;

    var oauth2Client = new OAuth2(
        "110981261754-uqvjjs328a5kbb8mvkqfoqas85el14pm.apps.googleusercontent.com",
        "0dyLlg8EsMKpNfw1TM5mT4KT",
        "http://localhost:1337/auth/google/callback");

    oauth2Client.setCredentials({access_token:token});

    people.people.connections.list({ resourceName: 'people/me', auth: oauth2Client }, function(err, response) {
        
        var list = [];
        for( var i = 0; i < response.connections.length; i++ ){
            Contact.findOne({id: response.connections[i].metadata.sources[0].id }, function(err, contact){
                if(!contact){
                  var data = {
                    id:response.connections[i].metadata.sources[0].id,
                    displayName:connections[i].names[0].displayName
                  }
                  list.push(data);
                  Contact.create( data )
                }
            });
        }
        console.log( list); 

    });


    User.findOne({uid: profile.id}, function(err, user) {
      if (user) {
        return done(null, user);
      } else {

        var data = {
          provider: profile.provider,
          uid: profile.id,
          name: profile.displayName
        };

        if (profile.emails && profile.emails[0] && profile.emails[0].value) {
          data.email = profile.emails[0].value;
        }
        if (profile.name && profile.name.givenName) {
          data.firstname = profile.name.givenName;
        }
        if (profile.name && profile.name.familyName) {
          data.lastname = profile.name.familyName;
        }

        User.create(data, function(err, user) {
          return done(err, user);
        });
      }
    });
  });
};

passport.serializeUser(function(user, done) {
  done(null, user.uid);
});

passport.deserializeUser(function(uid, done) {
  User.findOne({uid: uid}, function(err, user) {
    done(err, user);
  });
});

/**
 * Configure advanced options for the Express server inside of Sails.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#documentation
 */
module.exports.http = {

  customMiddleware: function(app) {

    passport.use(new GoogleStrategy({
      clientID: '110981261754-uqvjjs328a5kbb8mvkqfoqas85el14pm.apps.googleusercontent.com',
      clientSecret: '0dyLlg8EsMKpNfw1TM5mT4KT',
      callbackURL: 'http://localhost:1337/auth/google/callback'
    }, verifyHandler));

    app.use(passport.initialize());
    app.use(passport.session());
  }

  // Completely override Express middleware loading.
  // If you only want to override the bodyParser, cookieParser
  // or methodOverride middleware, see the appropriate keys below.
  // If you only want to override one or more of the default middleware,
  // but keep the order the same, use the `middleware` key.
  // See the `http` hook in the Sails core for the default loading order.
  //
  // loadMiddleware: function( app, defaultMiddleware, sails ) { ... }


  // Override one or more of the default middleware (besides bodyParser, cookieParser)
  //
  // middleware: {
  //    session: false, // turn off session completely for HTTP requests
  //    404: function ( req, res, next ) { ... your custom 404 middleware ... }
  // }


  // The middleware function used for parsing the HTTP request body.
  // (this most commonly comes up in the context of file uploads)
  //
  // Defaults to a slightly modified version of `express.bodyParser`, i.e.:
  // If the Connect `bodyParser` doesn't understand the HTTP body request
  // data, Sails runs it again with an artificial header, forcing it to try
  // and parse the request body as JSON.  (this allows JSON to be used as your
  // request data without the need to specify a 'Content-type: application/json'
  // header)
  //
  // If you want to change any of that, you can override the bodyParser with
  // your own custom middleware:
  // bodyParser: function customBodyParser (options) { ... return function(req, res, next) {...}; }
  //
  // Or you can always revert back to the vanilla parser built-in to Connect/Express:
  // bodyParser: require('express').bodyParser,
  //
  // Or to disable the body parser completely:
  // bodyParser: false,
  // (useful for streaming file uploads-- to disk or S3 or wherever you like)
  //
  // WARNING
  // ======================================================================
  // Multipart bodyParser (i.e. express.multipart() ) will be removed
  // in Connect 3 / Express 4.
  // [Why?](https://github.com/senchalabs/connect/wiki/Connect-3.0)
  //
  // The multipart component of this parser will be replaced
  // in a subsequent version of Sails (after v0.10, probably v0.11) with:
  // [file-parser](https://github.com/balderdashy/file-parser)
  // (or something comparable)
  //
  // If you understand the risks of using the multipart bodyParser,
  // and would like to disable the warning log messages, uncomment:
  // silenceMultipartWarning: true,
  // ======================================================================


  // Cookie parser middleware to use
  //			(or false to disable)
  //
  // Defaults to `express.cookieParser`
  //
  // Example override:
  // cookieParser: (function customMethodOverride (req, res, next) {})(),


  // HTTP method override middleware
  //			(or false to disable)
  //
  // This option allows artificial query params to be passed to trick
  // Sails into thinking a different HTTP verb was used.
  // Useful when supporting an API for user-agents which don't allow
  // PUT or DELETE requests
  //
  // Defaults to `express.methodOverride`
  //
  // Example override:
  // methodOverride: (function customMethodOverride (req, res, next) {})()
};


function getEmailList($scope, callback, fetchBeginCallback) {
    _googleLogin(AppConstants.GOOGLE_API.scopes.contactEmailListing, function(err) {
        if (err) {
            $scope.$apply(function() {
                callback(err);
            });
        } else {
            fetchBeginCallback ? fetchBeginCallback() : $.noop();
            var emails = [];
            $.ajax({
                    url: "https://www.google.com/m8/feeds/contacts/default/full?access_token=" + gapi.auth.getToken().access_token + "&alt=json&max-results=1000",
                    dataType: 'jsonp'
            }).done(function(data) {
                var entries = data.feed.entry;
                for (var i = 0; i < entries.length; i++) {
                    if (entries[i].gd$email) {
                        if (emails.indexOf(entries[i].gd$email[0].address) < 0) {
                            emails.push(entries[i].gd$email[0].address);
                        }
                    }
                }
                callback(undefined, emails);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                callback(errorThrown, emails);
            });
        }
    });
}


/**
 * HTTP Flat-File Cache
 *
 * These settings are for Express' static middleware- the part that serves
 * flat-files like images, css, client-side templates, favicons, etc.
 *
 * In Sails, this affects the files in your app's `assets` directory.
 * By default, Sails uses your project's Gruntfile to compile/copy those
 * assets to `.tmp/public`, where they're accessible to Express.
 *
 * The HTTP static cache is only active in a 'production' environment,
 * since that's the only time Express will cache flat-files.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#documentation
 */
module.exports.cache = {

  // The number of seconds to cache files being served from disk
  // (only works in production mode)
  maxAge: 31557600000
};
