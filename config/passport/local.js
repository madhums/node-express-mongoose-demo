
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var config = require('config');
var User = mongoose.model('User');

/**
 * Expose
 */

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    var options = {
      criteria: { email: email }
    };
    User.load(options, function (err, user) {
      if (err) return done(err)
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'Invalid password' });
      }
      return done(null, user);
    });
  }
);
