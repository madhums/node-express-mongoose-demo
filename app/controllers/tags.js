/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Article = mongoose.model('Article');

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
  var criteria = { tags: req.params.tag };
  var perPage = 5;
  var page = (req.params.page > 0 ? req.params.page : 1) - 1;
  var options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  };

  Article.list(options, function(err, articles) {
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
