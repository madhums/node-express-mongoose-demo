
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

  article.addComment(user, req.body, function (err) {
    if (err) return res.render('500')
    res.redirect('/articles/'+ article.id)
  })
}
