
var mongoose = require('mongoose')
  , Article = mongoose.model('Article')

// New article
exports.new = function(req, res){
  res.render('articles/new', {
    title: 'New Article',
    article: new Article({})
  })
}


// Create an article
exports.create = function (req, res) {
  var article = new Article(req.body.article)
  article.user = req.user

  article.save(function(err){
    if (err) {
      res.render('articles/new', {
          title: 'New Article'
        , article: article
        , errors: err.errors
      })
    }
    else {
      res.redirect('/article/'+article._id)
    }
  })
}


// Edit an article
exports.edit = function (req, res) {
  res.render('articles/edit', {
    title: 'Edit '+req.article.title,
    article: req.article
  })
}


// Update article
exports.update = function(req, res){
  var article = req.article

  article.save(function(err, doc) {
    if (err) {
      utils.mongooseErrorHandler(err, req)
      res.render('articles/edit', {
          title: 'Edit Article'
        , article: article
        , errors: err.errors
      })
    }
    else {
      res.redirect('/article/'+article._id)
    }
  })
}


// View an article
exports.show = function(req, res){
  res.render('articles/show', {
    title: req.article.title,
    article: req.article,
    comments: req.comments
  })
}


// Delete an article
exports.destroy = function(req, res){
  var article = req.article
  article.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    res.redirect('/articles')
  })
}


// Listing of Articles
exports.index = function(req, res){
  Article
    .find({})
    .populate('user')
    .populate('comments')
    .sort({'created_at': -1}) // sort by date
    .exec(function(err, articles) {
      if (err) throw err
      res.render('articles/index', {
        title: 'List of Articles',
        articles: articles
      })
    })
}

