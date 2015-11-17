'use strict';

/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} errors
 * @return {Array}
 * @api public
 */

exports.errors = function (errors) {
  if (typeof errors === 'string') return [errors];

  errors = errors || {};
  const keys = Object.keys(errors);
  const errs = [];

  // if there is no validation error, just display a generic error
  if (!keys) {
    errs.push('Oops! There was an error');
    return errs;
  }

  keys.forEach(key => {
    if (errors[key]) errs.push(errors[key].message);
  });

  return errs;
};

/**
 * Index of object within an array
 *
 * @param {Array} arr
 * @param {Object} obj
 * @return {Number}
 * @api public
 */

exports.indexof = function (arr, obj) {
  let index = -1; // not found initially
  const keys = Object.keys(obj);

  // filter the collection with the given criterias
  arr.filter(function (doc, idx) {

    // keep a counter of matched key/value pairs
    let matched = 0;

    // loop over criteria
    for (let i = keys.length - 1; i >= 0; i--) {
      if (doc[keys[i]] === obj[keys[i]]) {
        matched++;

        // check if all the criterias are matched
        if (matched === keys.length) {
          index = idx;
          return idx;
        }
      }
    }
  });

  return index;
};

/**
 * Find object in an array of objects that matches a condition
 *
 * @param {Array} arr
 * @param {Object} obj
 * @param {Function} cb - optional
 * @return {Object}
 * @api public
 */

exports.findByParam = function (arr, obj, cb) {
  const index = exports.indexof(arr, obj);

  if (~index && typeof cb === 'function') {
    return cb(undefined, arr[index]);
  } else if (~index && !cb) {
    return arr[index];
  } else if (!~index && typeof cb === 'function') {
    return cb('not found');
  }
};
