var mongoose = require('mongoose')
  , User = mongoose.model('User')

exports.signin = function (req, res) {}

// auth callback
exports.authCallback = function (req, res, next) {
  res.redirect('/')
}

// login
exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login'
  })
}

// logout
exports.logout = function (req, res) {
  req.logout()
  res.redirect('/articles')
}

// show profile
exports.show = function (req, res) {
  var user = req.profile
  res.render('users/show', {
      title: user.name
    , user: user
  })
}
