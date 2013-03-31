
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Imager = require('imager')
  , async = require('async')
  , Article = mongoose.model('Article')
  , _ = require('underscore')

/**
 * Find article by id
 */

exports.article = function(req, res, next, id){
  var User = mongoose.model('User')

  Article.load(id, function (err, article) {
    if (err) return next(err)
    if (!article) return next(new Error('Failed to load article ' + id))
    req.article = article
    next()
  })
}

/**
 * New article
 */

exports.new = function(req, res){
  res.render('articles/new', {
    title: 'New Article',
    article: new Article({})
  })
}

/**
 * Create an article
 */

exports.create = function (req, res) {
  var article = new Article(req.body)
  article.user = req.user

  article.uploadAndSave(req.files.image, function (err) {
    if (err) {
      res.render('articles/new', {
        title: 'New Article',
        article: article,
        errors: err.errors
      })
    }
    else {
      res.redirect('/articles/'+article._id)
    }
  })
}

/**
 * Edit an article
 */

exports.edit = function (req, res) {
  res.render('articles/edit', {
    title: 'Edit '+req.article.title,
    article: req.article
  })
}

/**
 * Update article
 */

exports.update = function(req, res){
  var article = req.article
  article = _.extend(article, req.body)

  article.uploadAndSave(req.files.image, function(err) {
    if (err) {
      res.render('articles/edit', {
        title: 'Edit Article',
        article: article,
        errors: err.errors
      })
    }
    else {
      res.redirect('/articles/' + article._id)
    }
  })
}

/**
 * View an article
 */

exports.show = function(req, res){
  res.render('articles/show', {
    title: req.article.title,
    article: req.article
  })
}

/**
 * Delete an article
 */

exports.destroy = function(req, res){
  var article = req.article
  article.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    res.redirect('/articles')
  })
}

/**
 * List of Articles
 */

exports.index = function(req, res){
  var page = req.param('page') > 0 ? req.param('page') : 0
  var perPage = 15
  var options = {
    perPage: perPage,
    page: page
  }

  Article.list(options, function(err, articles) {
    if (err) return res.render('500')
    Article.count().exec(function (err, count) {
      res.render('articles/index', {
        title: 'List of Articles',
        articles: articles,
        page: page,
        pages: count / perPage
      })
    })
  })
}
