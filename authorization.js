
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/login')
  }
  next()
};


/*
 *  User authorizations routing middleware
 */

exports.user = {
    hasAuthorization : function (req, res, next) {
      if (req.profile.id != req.user.id) {
        res.redirect('/users/'+req.profile.id)
      }
      next()
    }
}


/*
 *  Article authorizations routing middleware
 */

exports.article = {
    hasAuthorization : function (req, res, next) {
      if (req.article.user.id != req.user.id) {
        res.redirect('/articles/'+req.article.id)
      }
      next()
    }
}
