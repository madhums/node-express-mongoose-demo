var User = mongoose.model('User')

module.exports = function (app) {

  app.param('profileId', function (req, res, next, id) {
    User
      .findOne({ _id : id })
      .run(function (err, user) {
        if (err) return next(err)
        if (!user) return next(new Error('Failed to load User ' + id))
        req.foundUser = user
        next()
      })
  })

  // Handles session Logout
  app.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/articles')
  })

  // Profile view
  app.get('/profile/:profileId', function (req, res) {
    var user = req.foundUser
    res.render('users/profile', {
        title : user.fb.name.full
      , user : user
    })
  })


}
