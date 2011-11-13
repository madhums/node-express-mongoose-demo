var Article = require('../models/article');
var Comment = require('../models/comment');

module.exports = function(app){

  // New article
  app.get('/articles/new', function(req, res){
    res.render('articles/new', {
      title: 'New Article'
    });
  });

  app.param('id', function(req, res, next, id){
    Article
      .findOne({ _id : req.params.id }, function(err,article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + id));
        req.article = article;
        next();
      }).populate('comments');
  });

  // Create an article
  app.post('/articles', function(req, res){
    article = new Article(req.body.article);
    article.save(function(err){
      req.flash('notice', 'Created successfully');
      res.redirect('/article/'+article._id);
    });
  });

  // Edit an article
  app.get('/article/:id/edit', function(req, res){
    res.render('articles/edit', {
      title: 'Edit '+req.article.title,
      article: req.article
    });
  });

  // Update article
  app.put('/articles/:id', function(req, res){
    article = req.article;

    if (req.body.article.comment && req.body.article.comment.body) {
      var comment = new Comment({
        body : req.body.article.comment.body
      });
      article.comments.push(comment);
      req.flash('notice', 'Comment added successfully');
    }
    else {
      if (req.body.article.title) article.title = req.body.article.title;
      if (req.body.article.body) article.body = req.body.article.body;
      req.flash('notice', 'Updated successfully');
    }

    article.save(function(err, doc) {
      if (err) throw err;
      if (comment) {
        comment.save(function(err){
          if (err) throw err;
        });
      }
      res.redirect('/article/'+req.body.article._id);
    });
  });

  // View an article
  app.get('/article/:id', function(req, res){
    res.render('articles/show', {
      title: req.article.title,
      article: req.article
    });
  });

  // Delete an article
  app.del('/article/:id', function(req, res){
    article = req.article;
    article.remove(function(err){
      req.flash('notice', 'Deleted successfully');
      res.redirect('/articles');
    });
  });

  // Listing of Articles
  app.get('/articles', function(req, res){
    Article
      .find({})
      .desc('created_at') // sort by date
      .run(function(err, articles) {
        res.render('articles/index', {
          title: 'List of Articles',
          articles: articles
        });
      });
  });
};
