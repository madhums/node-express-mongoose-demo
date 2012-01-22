
var express = require('express')

exports.boot = function(app){
  bootErrorHandler(app)
}

// Error configuration

function bootErrorHandler(app) {

  // When no more middleware require execution, aka
  // our router is finished and did not respond, we
  // can assume that it is "not found". Instead of
  // letting Connect deal with this, we define our
  // custom middleware here to simply pass a NotFound
  // exception

  app.use(function(req, res, next){
    next(new NotFound(req.url))
  })

  // Provide our app with the notion of NotFound exceptions

  function NotFound(path){
    this.name = 'NotFound'
    if (path) {
      Error.call(this, 'Cannot find ' + path)
      this.path = path
    } else {
      Error.call(this, 'Not Found')
    }
    Error.captureStackTrace(this, arguments.callee)
  }

  /**
   * Inherit from `Error.prototype`.
   */

  NotFound.prototype.__proto__ = Error.prototype

  // We can call app.error() several times as shown below.
  // Here we check for an instanceof NotFound and show the
  // 404 page, or we pass on to the next error handler.

  // These handlers could potentially be defined within
  // configure() blocks to provide introspection when
  // in the development environment.

  app.error(function(err, req, res, next){
    if (err instanceof NotFound){
      console.log(err.stack)
      res.render('404', {
        status: 404,
        error: err,
        showStack: app.settings.showStackError,
        title: 'Oops! The page you requested desn\'t exist'
      })
    }
    else {
      console.log(err.stack)
      res.render('500', {
        status: 500,
        error: err,
        showStack: app.settings.showStackError,
        title: 'Oops! Something went wrong!'
      })
    }
  })

}
