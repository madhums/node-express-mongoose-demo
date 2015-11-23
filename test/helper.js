'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const async = require('async');
const Article = mongoose.model('Article');
const User = mongoose.model('User');

/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */

exports.cleanup = function (done) {
  done = done || () => {};
  async.parallel([
    cb => User.collection.remove(cb),
    cb => Article.collection.remove(cb)
  ], done);
};
