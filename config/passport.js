
/*!
 * Module dependencies.
 */

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');

var config = require('./config')

var local = require('./passport/local');
var google = require('./passport/google');
var facebook = require('./passport/facebook');
var twitter = require('./passport/twitter');
var linkedin = require('./passport/linkedin');
var github = require('./passport/github');

/**
 * Expose
 */

module.exports = function (passport) {
  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.load({ criteria: { _id: id } }, function (err, user) {
      done(err, user)
    })
  })

  // use these strategies
  passport.use(local);

  if(config.google.clientID) 
    passport.use(google);

  if(config.facebook.clientID)
    passport.use(facebook);

  if(config.twitter.clientID)
    passport.use(twitter);

  if(config.linkedin.clientID)
    passport.use(linkedin);

  if(config.github.clientID)
    passport.use(github);
};
