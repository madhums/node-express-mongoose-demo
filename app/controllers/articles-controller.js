var Article = mongoose.model('Article')
  , Comment = mongoose.model('Comment')

module.exports = function(app){

  // New article
  app.get('/articles/new', function(req, res){
    res.render('articles/new', {
      title: 'New Article',
      article: new Article({})
    })
  })

  app.param('id', function(req, res, next, id){
    Article
      .findOne({ _id : req.params.id })
      .populate('comments')
      .run(function(err,article) {
        if (err) return next(err)
        if (!article) return next(new Error('Failed to load article ' + id))
        req.article = article
        Comment
          .find({article : req.article})
          .run(function (err, comments) {
            if (err) throw err
            req.comments = comments
            next()
          })
      })
  })

  // Create an article
  app.post('/articles', function(req, res){
    article = new Article(req.body.article)

    article.save(function(err){
      if (err) {
        utils.mongooseErrorHandler(err, req)
        res.render('articles/new', {
            title: 'New Article'
          , article: article
        })
      }
      else {
        req.flash('notice', 'Created successfully')
        res.redirect('/article/'+article._id)
      }
    })
  })

  // Edit an article
  app.get('/article/:id/edit', function(req, res){
    res.render('articles/edit', {
      title: 'Edit '+req.article.title,
      article: req.article
    })
  })

  // Update article
  app.put('/articles/:id', function(req, res){
    article = req.article

    if (req.body.article.title) article.title = req.body.article.title
    if (req.body.article.body) article.body = req.body.article.body
    req.flash('notice', 'Updated successfully')

    article.save(function(err, doc) {
      if (err) throw err
      res.redirect('/article/'+req.body.article._id)
    })
  })

  // View an article
  app.get('/article/:id', function(req, res){
    res.render('articles/show', {
      title: req.article.title,
      article: req.article,
      comments: req.comments
    })
  })

  // Delete an article
  app.del('/article/:id', function(req, res){
    article = req.article
    article.remove(function(err){
      req.flash('notice', 'Deleted successfully')
      res.redirect('/articles')
    })
  })

  // Listing of Articles
  app.get('/articles', function(req, res){
    Article
      .find({})
      .desc('created_at') // sort by date
      .run(function(err, articles) {
        res.render('articles/index', {
          title: 'List of Articles',
          articles: articles
        })
      })
  })
}
