
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.session.auth && req.xhr);
  else if (!req.session.auth) {
    req.flash('notice', 'You are not authorized')
    if (req.item)
      res.redirect('/item/'+req.item.id)
    else if (req.foundUser)
      res.redirect('/profile/'+req.foundUser.id);
    else
      res.redirect('/home')
  }
  next()
};


/*
 *  User authorizations routing middleware
 */

exports.user = {
    hasAuthorization : function (req, res, next) {
      if (req.foundUser.id != req.session.auth.userId) {
        req.flash('notice', 'You are not authorized')
        res.redirect('/profile/'+req.foundUser.id)
      }
      next()
    }
}


/*
 *  Article authorizations routing middleware
 */

exports.article = {
    hasAuthorization : function (req, res, next) {
      if (req.item.owner.id != req.session.auth.userId) {
        req.flash('notice', 'You are not authorized');
        res.redirect('/item/'+req.item.id);
      }
      next()
    }
}  
