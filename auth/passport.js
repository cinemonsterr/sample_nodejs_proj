var FacebookStrategy = require('passport-facebook').Strategy;
const dbConn = require("./mongoConn.js");
var appUserObj = require('./appUser.js');
var configAuth = require('./auth.js');

module.exports = function (passport) {

  passport.serializeUser(function (appUser, done) {
    done(null, appUser && appUser._doc?appUser._doc:appUser);
  });

  passport.deserializeUser(function (id, done) {
    find_user(id, function (error, appUser) {
      done(error, appUser);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'first_name', 'last_name'],
  },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        find_user(profile.id, function (err, appUser) {
          if (err) {
            return done(err);
          }
          if (appUser.length > 0) {
            return done(null, appUser[0]);
          } else {
            let newUser = {
              "fb_id": profile.id,
              "displayName": profile.name.givenName + ' ' + profile.name.familyName
            }
            dbConn.writeToDB(appUserObj, newUser, function (err, createdUser) {
              if (err) {
                return done(err);
              }
              return done(null, createdUser[0]);
            })
          }
        })
      })
    }
  ));

  //custom functions
  function find_user(id, callback) {
    let retrieveFields = {
      fb_id: 1,
      displayName: 1,
      roles: 1,
      sites: 1
    };
    let condition = { fb_id: id };
    let sort = {};

    dbConn.retrieveFromDB(appUserObj, condition, retrieveFields, sort, function (err, appUser) {
      if (err) {
        callback(err);
      } else {
        callback(null, appUser);
      }
    });
  };
};
