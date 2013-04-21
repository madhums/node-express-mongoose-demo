
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
  , modelPath = config.root + '/app/models'
  , async = require('async')

require('fs').readdirSync(modelPath).forEach(function (file) {
  require(modelPath + '/' + file)
})
