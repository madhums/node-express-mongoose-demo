var mongoose = require('mongoose')
  , Article = mongoose.model('Article')

exports.index = function (req, res) {
  var perPage = 5
    , page = req.param('page') > 0 ? req.param('page') : 0

  Article
    .find({ tags: req.param('tag') })
    .populate('user', 'name')
    .sort({'createdAt': -1}) // sort by date
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, articles) {
      if (err) return res.render('500')
      Article.count({ tags: req.param('tag') }).exec(function (err, count) {
        res.render('articles/index', {
            title: 'List of Articles'
          , articles: articles
          , page: page
          , pages: count / perPage
        })
      })
    })
}
