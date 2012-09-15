
var mongoose = require('mongoose')
  , Article = mongoose.model('Article')
  , User = mongoose.model('User')
  , async = require('async')

module.exports = function (app, passport, auth) {

  // user routes
  var users = require('../app/controllers/users')
  app.get('/login', users.login)
  app.get('/logout', users.logout)
  app.get('/users/:userId', users.show)
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/' }), users.signin)
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), users.authCallback)
  app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/' }), users.signin)
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), users.authCallback)
  app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/' }), users.signin)
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }), users.authCallback)

  app.param('userId', function (req, res, next, id) {
    User
      .findOne({ _id : id })
      .exec(function (err, user) {
        if (err) return next(err)
        if (!user) return next(new Error('Failed to load User ' + id))
        req.profile = user
        next()
      })
  })

  // article routes
  var articles = require('../app/controllers/articles')
  app.get('/articles', articles.index)
  app.get('/articles/new', auth.requiresLogin, articles.new)
  app.post('/articles', auth.requiresLogin, articles.create)
  app.get('/articles/:id', articles.show)
  app.get('/articles/:id/edit', auth.requiresLogin, articles.edit)
  app.put('/articles/:id', auth.requiresLogin, articles.update)
  app.del('/articles/:id', auth.requiresLogin, articles.destroy)

  app.param('id', function(req, res, next, id){
    Article
      .findOne({ _id : id })
      .populate('user', 'name')
      .populate('comments')
      .exec(function (err, article) {
        if (err) return next(err)
        if (!article) return next(new Error('Failed to load article ' + id))
        req.article = article

        var populateComments = function (comment, cb) {
          User
            .findOne({ _id: comment._user }, 'name')
            .exec(function (err, user) {
              if (err) return next(err)
              comment.user = user
              cb(null, comment)
            })
        }

        if (article.comments.length) {
          async.map(article.comments, populateComments, function (err, results) {
            next(err)
          })
        }
        else
          next()
      })
  })

  // home route
  app.get('/', articles.index)

  // comment routes
  var comments = require('../app/controllers/comments')
  app.post('/articles/:id/comments', auth.requiresLogin, comments.create)

}
