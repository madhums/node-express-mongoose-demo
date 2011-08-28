
/**
 * Module dependencies.
 */

var express = require('express'),
    sys = require('sys'),
    app = module.exports = express.createServer(),
    models = require('./model');
    Article = models.Article;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});



// Root

app.get('/', function(req, res){
  res.redirect('/articles');
});


// Article Routes

// Listing of Articles
app.get('/articles', function(req, res){
  Article.find({}, function(err, docs) {
    res.render('articles/index', {
      title: 'List of Articles',
      articles: docs
    });
  });
});

// New article
app.get('/articles/new', function(req, res){
  res.render('articles/new', {
    title: 'New Article'
  });
});

// Create/Update articles
app.post('/articles', function(req, res){
  if(req.body.article._id)
    Article.findOne({_id:req.body.article._id}, function(err, a) {
      a.title = req.body.article.title;
      a.body = req.body.article.body;
      a.save(function(err) {
        console.log(err);
      })
    });
  else {
    article = new Article(req.body.article);
    article.save(function(err){
      console.log("Created");
    });
  }

  res.redirect('/articles');

});

// View an article
app.get('/article/:id', function(req, res){
  Article.findOne({_id:req.params.id}, function(err,article){
    res.render('articles/show', {
      title: article.title,
      article: article
    });
  });
});

// Edit an article
app.get('/article/:id/edit', function(req, res){
  Article.findOne({_id:req.params.id}, function(err,article){
    res.render('articles/edit', {
      title: 'Edit '+ article.title,
      article: article
    });
  });
});

app.put('/article/:id', function(req, res){
    Article.findOne({_id:req.params.id}, function(err, a) {
      a.title = req.body.article.title;
      a.body = req.body.article.body;
      a.save(function(err) {
        console.log("updated");
      })
    });	
	res.redirect('/articles');	
});


// Delete an article
app.del('/article/:id', function(req, res){
  Article.findOne({_id:req.params.id}, function(err,article){
    article.remove(function(err){
      console.log(err);
    });
  });
  res.redirect('/articles');
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
