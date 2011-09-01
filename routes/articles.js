var Article = require('../models/article');

module.exports = function(app){

  // New article
  app.get('/articles/new', function(req, res){
    res.render('articles/new', {
      title: 'New Article'
    });
  });

  // Create an article
  app.post('/articles', function(req, res){
    article = new Article(req.body.article);
    article.save(function(err){
      console.log("Created");
      req.flash('notice', 'Created successfully');
      res.redirect('/article/'+article._id);
    });
  });

  // Edit an article
  app.get('/article/:id/edit', function(req, res){
    Article.findOne({_id:req.params.id}, function(err,article){
      res.render('articles/edit', {
        title: 'Edit '+article.title,
        article: article
      });
    });
  });

  // Update article
  app.put('/articles/:id', function(req, res){
    Article.findOne({_id:req.body.article._id}, function(err, a) {
      a.title = req.body.article.title;
      a.body = req.body.article.body;
      a.save(function(err) {
        console.log("Updated");
        req.flash('notice', 'Updated successfully');
        res.redirect('/article/'+req.body.article._id);
      })
    });
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

  // Delete an article
  app.del('/article/:id', function(req, res){
    Article.findOne({_id:req.params.id}, function(err,article){
      article.remove(function(err){
        console.log(err);
        req.flash('notice', 'Deleted successfully');
        res.redirect('/articles');
      });
    });
  });

  // Listing of Articles
  app.get('/articles', function(req, res){
    Article.find({}, function(err, articles) {
      res.render('articles/index', {
        title: 'List of Articles',
        articles: articles
      });
    });
  });
};
