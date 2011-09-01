
/**
 * Module dependencies.
 */

var fs = require('fs'),
    express = require('express'),
    basicAuth = require('express').basicAuth,
    stylus = require('stylus'),
    csrf = require('express-csrf'),
    gzippo = require('gzippo');

exports.boot = function(app){
  bootApplication(app);
  bootErrorConfig(app);
};

// App settings and middleware

function bootApplication(app) {
  app.configure(function(){

    // set views path, template engine and default layout
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: 'layouts/default' });

    // bodyParser should be above methodOverride
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // cookieParser should be above session
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'keyboard cat' }));

    app.use(express.logger(':method :url :status'));
    app.use(express.favicon());

    // routes should be at the last
    app.use(app.router);
  });

  // Setup ejs views as default, with .html as the extension
  //app.set('views', __dirname + '/views');
  //app.register('.html', require('ejs'));
  //app.set('view engine', 'html');

  // Some dynamic view helpers
  app.dynamicHelpers({

    request: function(req){
      return req;
    },

    hasMessages: function(req){
      if (!req.session) return false;
      return Object.keys(req.session.flash || {}).length;
    },

    // flash messages
    messages: require('express-messages'),

    // dateformat helper. Thanks to gh-/loopj/commonjs-date-formatting
    dateformat: function(req, res) {
      return require('./lib/dateformat').strftime;
    },

    // generate token using express-csrf module
    csrf: csrf.token

  });


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
   // .define('url', stylus.url({ paths: [__dirname + '/public/images'], limit:1000000 }));
  };

  // add the stylus middleware, which re-compiles when
  // a stylesheet has changed, compiling FROM src,
  // TO dest. dest is optional, defaulting to src

  app.use(stylus.middleware({
      debug: true
    , src: __dirname + '/stylus'
    , dest: __dirname + '/public'
    , compile: compile
  }));

  // the middleware itself does not serve the static
  // css files, so we need to expose them with staticProvider
  // We will be defining static provider when we setup env specific settings

  // Don't use express errorHandler as we are using custom error handlers
  // app.use(express.errorHandler({ dumpExceptions: false, showStack: false }));

  // show error on screen. False for all envs except development
  // settmgs for custom error handlers
  app.set('showStackError', false);

  // configure environments

  var oneYear = 31557600000;

  app.configure('development', function(){
    app.set('showStackError', true);
    app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  });

  // gzip only in staging and production envs

  app.configure('staging', function(){
    app.use(gzippo.staticGzip(__dirname + '/public', { maxAge: oneYear }));
    //app.enable('view cache');
  });

  app.configure('production', function(){
    app.use(gzippo.staticGzip(__dirname + '/public', { maxAge: oneYear }));
    // view cache is enabled by default in production mode
  });

  // check for csrf using express-csrf module
  app.use(csrf.check());

}

// Error configuration

function bootErrorConfig(app) {

  // When no more middleware require execution, aka
  // our router is finished and did not respond, we
  // can assume that it is "not found". Instead of
  // letting Connect deal with this, we define our
  // custom middleware here to simply pass a NotFound
  // exception

  app.use(function(req, res, next){
    next(new NotFound(req.url));
  });

  // Provide our app with the notion of NotFound exceptions

  function NotFound(path){
    this.name = 'NotFound';
    if (path) {
      Error.call(this, 'Cannot find ' + path);
      this.path = path;
    } else {
      Error.call(this, 'Not Found');
    }
    Error.captureStackTrace(this, arguments.callee);
  }

  /**
   * Inherit from `Error.prototype`.
   */

  NotFound.prototype.__proto__ = Error.prototype;

  // We can call app.error() several times as shown below.
  // Here we check for an instanceof NotFound and show the
  // 404 page, or we pass on to the next error handler.

  // These handlers could potentially be defined within
  // configure() blocks to provide introspection when
  // in the development environment.

  app.error(function(err, req, res, next){
    if (err instanceof NotFound){
      console.log(err.stack);
      res.render('404', {
        layout: 'layouts/default',
        status: 404,
        error: err,
        showStack: app.settings.showStackError,
        title: 'Oops! The page you requested desn\'t exist'
      });
    }
    else {
      console.log(err.stack);
      res.render('500', {
        layout: 'layouts/default',
        status: 500,
        error: err,
        showStack: app.settings.showStackError,
        title: 'Oops! Something went wrong!'
      });
    }
  });


  /**
   * Apply basic auth to all post related routes
   */

  // If you need basic auth, uncomment the below
  /*
  app.all('(/*)?', basicAuth(function(user, pass){
    return 'user' == user && 'pass' == pass;
  }));
  */

  // Routes

  app.get('/', function(req, res){
    res.redirect('/articles');
  });

}
