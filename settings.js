
/**
 * Module dependencies.
 */

var express = require('express')
  , gzippo = require('gzippo')
  , mongoStore = require('connect-mongodb')
  , mongooseAuth = require('mongoose-auth')
  , url = require('url')
  , stylus = require('stylus')

exports.boot = function(app){
  bootApplication(app)
}

// App settings and middleware

function bootApplication(app) {
  app.configure(function(){

    // set views path, template engine and default layout
    app.set('views', __dirname + '/app/views')
    app.set('view engine', 'jade')
    app.set('view options', { layout: 'layouts/default' })

    // contentFor & content view helper - to include blocks of content only on required pages
    app.use(function(req, res, next){
      // expose the current path as a view local
      res.local('path', url.parse(req.url).pathname)

      // assign content str for section
      res.local('contentFor', function(section, str){
        res.local(section, str)
      })

      // check if the section is defined and return accordingly
      res.local('content', function(section){
        if (typeof res.local(section) != 'undefined')
          return res.local(section)
        else
          return ''
      })

      next()
    })

    // bodyParser should be above methodOverride
    app.use(express.bodyParser())
    app.use(express.methodOverride())

    // cookieParser should be above session
    app.use(express.cookieParser())
    app.use(express.session({
      secret: 'noobjs',
      store: new mongoStore({
        url: config.db.uri,
        collection : 'sessions'
      })
    }))

    app.use(express.logger(':method :url :status'))
    app.use(express.favicon())

    // routes should be at the last
    // app.use(app.router)
    app.use(mongooseAuth.middleware())
  })

  // Setup ejs views as default, with .html as the extension
  //app.set('views', __dirname + '/views')
  //app.register('.html', require('ejs'))
  //app.set('view engine', 'html')

  // Some dynamic view helpers
  app.dynamicHelpers({

    request: function(req){
      return req
    },

    hasMessages: function(req){
      if (!req.session) return false
      return Object.keys(req.session.flash || {}).length
    },

    // flash messages
    messages: require('express-messages'),

    // dateformat helper. Thanks to gh-/loopj/commonjs-date-formatting
    dateformat: function(req, res) {
      return require('./lib/dateformat').strftime
    },

    base: function(){
      return '/' == app.route ? '' : app.route // return the app's mount-point so that urls can adjust.
    },

    appName : function(req, res) {
      return 'nodejs express mongoose demo'
    },

    slogan : function(req,res) {
      return 'nodejs express mongoose demo'
    }

  })


  // Use stylus for css templating

  // completely optional, however
  // the compile function allows you to
  // define additional functions exposed to Stylus,
  // alter settings, etc

  function compile(str, path) {
    return stylus(str)
      .set('filename', path)
      .set('warn', true)
      .set('compress', true)
   // .define('url', stylus.url({ paths: [__dirname + '/public/images'], limit:1000000 }))
  }

  // add the stylus middleware, which re-compiles when
  // a stylesheet has changed, compiling FROM src,
  // TO dest. dest is optional, defaulting to src

  app.use(stylus.middleware({
      debug: true
    , src: __dirname + '/stylus'
    , dest: __dirname + '/public'
    , compile: compile
  }))

  // Don't use express errorHandler as we are using custom error handlers
  // app.use(express.errorHandler({ dumpExceptions: false, showStack: false }))

  // show error on screen. False for all envs except development
  // settmgs for custom error handlers
  app.set('showStackError', false)

  // configure environments

  app.configure('development', function(){
    app.set('showStackError', true)
    app.use(express.static(__dirname + '/public'))
  })

  // gzip only in staging and production envs

  app.configure('staging', function(){
    app.use(gzippo.staticGzip(__dirname + '/public'))
    app.enable('view cache')
  })

  app.configure('production', function(){
    app.use(gzippo.staticGzip(__dirname + '/public'))
    // view cache is enabled by default in production mode
  })

}
