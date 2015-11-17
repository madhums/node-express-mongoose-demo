'use strict';

/*!
 * Module dependencies.
 */

const mongoose = require('mongoose');
const User = mongoose.model('User');

const local = require('./passport/local');
const google = require('./passport/google');
const facebook = require('./passport/facebook');
const twitter = require('./passport/twitter');
const linkedin = require('./passport/linkedin');
const github = require('./passport/github');

/**
 * Expose
 */

module.exports = function (passport) {

  // serialize sessions
  passport.serializeUser((user, cb) => cb(null, user.id));
  passport.deserializeUser((id, cb) => User.load({ criteria: { _id: id } }, cb));

  // use these strategies
  passport.use(local);
  passport.use(google);
  passport.use(facebook);
  passport.use(twitter);
  passport.use(linkedin);
  passport.use(github);
};
