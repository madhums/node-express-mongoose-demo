'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const User = mongoose.model('User');

/**
 * Clear database
 *
 * @param {Object} t<Ava>
 * @api public
 */

exports.cleanup = function* (t) {
  yield User.remove();
  yield Article.remove();
  t.end();
};
