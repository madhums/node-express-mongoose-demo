var Article = mongoose.model('Article')
  , Comment = mongoose.model('Comment')


module.exports = function(app){
  app.param('articleId', function(req, res, next, id){
    Article
      .findOne({ _id : id }, function(err,article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + id));
        req.article = article;
        next();
      })
  });

  app.post('/comment/:articleId', function (req, res) {
    if (req.body.comment && req.body.comment.body != '') {
      var comment = new Comment({})
      comment.article = req.article.id
      comment.body = req.body.comment.body
      comment.save(function (err) {
        if (err) throw err
        req.flash('notice', 'Comment added successfully')
        res.redirect('/article/'+req.article.id)
      })
    }
    else
      res.redirect('/article/'+req.article.id)
  })
}
