var mongoose = require('mongoose')
  , Comment = mongoose.model('Comment')

exports.create = function (req, res) {
  var comment = new Comment(req.body)
    , article = req.article

  comment._user = req.user

  comment.save(function (err) {
    if (err) throw new Error('Error while saving comment')
    article.comments.push(comment._id)
    article.save(function (err) {
      if (err) throw new Error('Error while saving article')
      res.redirect('/articles/'+article.id+'#comments')
    })
  })
}
