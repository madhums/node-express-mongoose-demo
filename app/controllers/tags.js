'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Article = mongoose.model('Article');

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
  const criteria = { tags: req.params.tag };
  const perPage = 5;
  const page = (req.params.page > 0 ? req.params.page : 1) - 1;
  const options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  };

  Article.list(options, function (err, articles) {
    if (err) return res.render('500');
    Article.count(criteria).exec(function (err, count) {
      res.render('articles/index', {
        title: 'Articles tagged ' + req.params.tag,
        articles: articles,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};
