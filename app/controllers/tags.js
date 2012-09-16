var mongoose = require('mongoose')
  , Article = mongoose.model('Article')

exports.index = function (req, res) {
  Article
    .find({ tags: req.param('tag') })
    .populate('user', 'name')
    .exec(function (err, articles) {
      res.render('articles/index', {
        articles: articles
      })
    })
}
