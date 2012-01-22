/* Main application entry file. Please note, the order of loading is important.
 * Configuration loading and booting of controllers and custom error handlers */

var express = require('express')
var fs = require('fs')
utils = require('./lib/utils')
auth = require('./authorization')


// Load configurations
var config_file = require('yaml-config')
exports = module.exports = config = config_file.readConfig('config/config.yaml')

require('./db-connect')                // Bootstrap db connection

// Bootstrap models
var models_path = __dirname + '/app/models'
var model_files = fs.readdirSync(models_path)
model_files.forEach(function(file){
  if (file == 'user.js')
    User = require(models_path+'/'+file)
  else
    require(models_path+'/'+file)
})

var app = express.createServer()       // express app
require('./settings').boot(app)        // Bootstrap application settings

// Bootstrap controllers
var controllers_path = __dirname + '/app/controllers'
var controller_files = fs.readdirSync(controllers_path)
controller_files.forEach(function(file){
  require(controllers_path+'/'+file)(app)
})

require('./error-handler').boot(app)   // Bootstrap custom error handler
mongooseAuth.helpExpress(app)          // Add in Dynamic View Helpers
everyauth.helpExpress(app, { userAlias: 'current_user' })

// Start the app by listening on <port>
var port = process.env.PORT || 3000
app.listen(port)
console.log('Express app started on port '+port)
