'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const utils = require('../../lib/utils');
const assign = require('object-assign');


/**
 * Load
 */

exports.load = function (req, res, next, id){
  Article.load(id, function (err, article) {
    if (err) return next(err);
    if (!article) return next(new Error('not found'));
    req.article = article;
    next();
  });
};

/**
 * List
 */

exports.index = function (req, res) {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const perPage = 30;
  const options = {
    perPage: perPage,
    page: page
  };

  Article.list(options, function (err, articles) {
    if (err) return res.render('500');
    Article.count().exec(function (err, count) {
      res.render('articles/index', {
        title: 'Articles',
        articles: articles,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};

/**
 * New article
 */

exports.new = function (req, res){
  res.render('articles/new', {
    title: 'New Article',
    article: new Article({})
  });
};

/**
 * Create an article
 * Upload an image
 */

exports.create = function (req, res) {
  const article = new Article(req.body);
  const images = req.files.image
    ? [req.files.image]
    : undefined;

  article.user = req.user;
  article.uploadAndSave(images, function (err) {
    if (!err) {
      req.flash('success', 'Successfully created article!');
      return res.redirect('/articles/'+article._id);
    }
    res.render('articles/new', {
      title: 'New Article',
      article: article,
      errors: utils.errors(err.errors || err)
    });
  });
};

/**
 * Edit an article
 */

exports.edit = function (req, res) {
  res.render('articles/edit', {
    title: 'Edit ' + req.article.title,
    article: req.article
  });
};

/**
 * Update article
 */

exports.update = function (req, res){
  const article = req.article;
  const images = req.files.image
    ? [req.files.image]
    : undefined;

  // make sure no one changes the user
  delete req.body.user;
  assign(article, req.body);

  article.uploadAndSave(images, function (err) {
    if (!err) {
      return res.redirect('/articles/' + article._id);
    }

    res.render('articles/edit', {
      title: 'Edit Article',
      article: article,
      errors: utils.errors(err.errors || err)
    });
  });
};

/**
 * Show
 */

exports.show = function (req, res){
  res.render('articles/show', {
    title: req.article.title,
    article: req.article
  });
};

/**
 * Delete an article
 */

exports.destroy = function (req, res){
  const article = req.article;
  article.remove(function () {
    req.flash('info', 'Deleted successfully');
    res.redirect('/articles');
  });
};
