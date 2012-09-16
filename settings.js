
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoStore = require('connect-mongodb')

exports.boot = function(app, config, passport){
  bootApplication(app, config, passport)
}

// App settings and middleware

function bootApplication(app, config, passport) {

  app.set('showStackError', true)

  app.use(express.static(__dirname + '/public'))

  app.use(express.logger(':method :url :status'))

  // set views path, template engine and default layout
  app.set('views', __dirname + '/app/views')
  app.set('view engine', 'jade')

  app.configure(function () {
    // dynamic helpers
    app.use(function (req, res, next) {
      res.locals.appName = 'Nodejs Express Mongoose Demo'
      res.locals.title = 'Nodejs Express Mongoose Demo'
      res.locals.showStack = app.showStackError
      res.locals.req = req
      res.locals.formatDate = function (date) {
        var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec" ]
        return monthNames[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear()
      }
      res.locals.stripScript = function (str) {
        return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      }

      next()
    })

    // cookieParser should be above session
    app.use(express.cookieParser())

    // bodyParser should be above methodOverride
    app.use(express.bodyParser())
    app.use(express.methodOverride())

    app.use(express.session({
      secret: 'noobjs',
      store: new mongoStore({
        url: config.db,
        collection : 'sessions'
      })
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    app.use(express.favicon())

    // routes should be at the last
    app.use(app.router)

    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    app.use(function(err, req, res, next){
      // treat as 404
      if (~err.message.indexOf('not found')) return next()

      // log it
      console.error(err.stack)

      // error page
      res.status(500).render('500')
    })

    // assume 404 since no middleware responded
    app.use(function(req, res, next){
      res.status(404).render('404', { url: req.originalUrl })
    })

  })

  app.set('showStackError', false)

}
