
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Article = mongoose.model('Article')

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
  var criteria = { tags: req.param('tag') }
  var perPage = 5
  var page = req.param('page') > 0 ? req.param('page') : 0
  var options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  }

  Article.list(options, function(err, articles) {
    if (err) return res.render('500')
    Article.count(criteria).exec(function (err, count) {
      res.render('articles/index', {
        title: 'Articles tagged ' + req.param('tag'),
        articles: articles,
        page: page,
        pages: count / perPage
      })
    })
  })
}
