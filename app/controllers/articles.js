'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const assign = require('object-assign');
const wrap = require('co-express');
const only = require('only');
const Article = mongoose.model('Article');

/**
 * Load
 */

exports.load = wrap(function* (req, res, next, id) {
  req.article = yield Article.load(id);
  if (!req.article) return next(new Error('Article not found'));
  next();
});

/**
 * List
 */

exports.index = wrap(function* (req, res) {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const limit = 30;
  const options = {
    limit: limit,
    page: page
  };

  const articles = yield Article.list(options);
  const count = yield Article.count();

  res.render('articles/index', {
    title: 'Articles',
    articles: articles,
    page: page + 1,
    pages: Math.ceil(count / limit)
  });
});

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

exports.create = wrap(function* (req, res) {
  const article = new Article(only(req.body, 'title body tags'));
  const images = req.files.image
    ? [req.files.image]
    : undefined;

  article.user = req.user;
  yield article.uploadAndSave(images);
  req.flash('success', 'Successfully created article!');
  res.redirect('/articles/' + article._id);
});

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

exports.update = wrap(function* (req, res){
  const article = req.article;
  const images = req.files.image
    ? [req.files.image]
    : undefined;

  assign(article, only(req.body, 'title body tags'));
  yield article.uploadAndSave(images);
  res.redirect('/articles/' + article._id);
});

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

exports.destroy = wrap(function* (req, res) {
  yield req.article.remove();
  req.flash('success', 'Deleted successfully');
  res.redirect('/articles');
});
