
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')

/**
 * Create comment
 */

exports.create = function (req, res) {
  var article = req.article
  var user = req.user

  if (!req.body.body) return res.redirect('/articles/'+ article.id)

  article.comments.push({
    body: req.body.body,
    user: user._id
  })

  article.save(function (err) {
    if (err) return res.render('500')
    res.redirect('/articles/'+ article.id)
  })
}
