'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const only = require('only');
const { respond, respondOrRedirect } = require('../utils');
const Article = mongoose.model('Article');
const assign = Object.assign;

/**
 * Load
 */

exports.load = async(function* (req, res, next, id) {
  try {
    req.article = yield Article.load(id);
    if (!req.article) return next(new Error('Article not found'));
  } catch (err) {
    return next(err);
  }
  next();
});

/**
 * List
 */

exports.index = async(function* (req, res) {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const _id = req.query.item;
  const limit = 30;
  const options = {
    limit: limit,
    page: page
  };

  if (_id) options.criteria = { _id };

  const articles = yield Article.list(options);
  const count = yield Article.count();

  respond(res, 'articles/index', {
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
    article: new Article()
  });
};

/**
 * Create an article
 * Upload an image
 */

exports.create = async(function* (req, res) {
  const article = new Article(only(req.body, 'title body tags'));
  article.user = req.user;
  try {
    yield article.uploadAndSave(req.file);
    respondOrRedirect({ req, res }, `/articles/${article._id}`, article, {
      type: 'success',
      text: 'Successfully created article!'
    });
  } catch (err) {
    respond(res, 'articles/new', {
      title: article.title || 'New Article',
      errors: [err.toString()],
      article
    }, 422);
  }
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

exports.update = async(function* (req, res){
  const article = req.article;
  assign(article, only(req.body, 'title body tags'));
  try {
    yield article.uploadAndSave(req.file);
    respondOrRedirect({ res }, `/articles/${article._id}`, article);
  } catch (err) {
    respond(res, 'articles/edit', {
      title: 'Edit ' + article.title,
      errors: [err.toString()],
      article
    }, 422);
  }
});

/**
 * Show
 */

exports.show = function (req, res){
  respond(res, 'articles/show', {
    title: req.article.title,
    article: req.article
  });
};

/**
 * Delete an article
 */

exports.destroy = async(function* (req, res) {
  yield req.article.remove();
  respondOrRedirect({ req, res }, '/articles', {}, {
    type: 'info',
    text: 'Deleted successfully'
  });
});
