
/*!
 * nodejs-express-mongoose-demo
 * Copyright(c) 2013 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */
/**
 * Module dependencies
 */

var fs = require('fs');
var join = require('path').join;
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('config');

var app = express();
var port = process.env.PORT || 3000;

// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
fs.readdirSync(join(__dirname, 'app/models')).forEach(function (file) {
  if (~file.indexOf('.js')) require(join(__dirname, 'app/models', file));
});

// Bootstrap passport config
require('./config/passport')(passport);

// Bootstrap application settings
require('./config/express')(app, passport);

// Bootstrap routes
require('./config/routes')(app, passport);

app.listen(port);
console.log('Express app started on port ' + port);

/**
 * Expose
 */

module.exports = app;
