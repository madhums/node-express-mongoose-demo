var exports = module.exports = everyauth = require('everyauth')
  , Promise = everyauth.Promise
  , UserSchema = new Schema({})
  , User


var exports = module.exports = mongooseAuth = require('mongoose-auth')

everyauth.debug = true

// This is how you request permissions
everyauth.facebook.scope('email, user_about_me, user_location')

// Eleminate timeout completely
everyauth.facebook.moduleTimeout(-1)

// To see all the configurable options
// console.log(everyauth.facebook.configurable())

UserSchema.add({
    bio: String
  , location: {
      name: String
    }
  , fbProfileUrl: String
  , created_at  : {type : Date, default : Date.now}
})


UserSchema.plugin(mongooseAuth, {
    everymodule: {
      everyauth: {
        User: function () {
          return User
        }
      }
    }
  , facebook: {
      everyauth: {
          myHostname: config.facebook.host_uri
        , appId: config.facebook.appId
        , appSecret: config.facebook.appSecret
        , redirectPath: '/'
        , findOrCreateUser: function (sess, accessTok, accessTokExtra, fbUser) {
            var promise = this.Promise()
              , User = this.User()()
            // TODO Check user in session or request helper first
            //      e.g., req.user or sess.auth.userId
            User.findOne({'fb.id': fbUser.id}, function (err, foundUser) {
              if (err) return promise.fail(err)
              if (foundUser) {
                return promise.fulfill(foundUser)
              }
              console.log("CREATING")

              var expiresDate = new Date
              expiresDate.setSeconds(expiresDate.getSeconds() + accessTokExtra)

              user = new User({
                  fb: {
                      id: fbUser.id
                    , accessToken: accessTok
                    , expires: expiresDate
                    , name: {
                          full: fbUser.name
                        , first: fbUser.first_name
                        , last: fbUser.last_name
                      }
                    , alias: fbUser.link.match(/^http:\/\/www.facebook\.com\/(.+)/)[1]
                    , gender: fbUser.gender
                    , email: fbUser.email
                    , timezone: fbUser.timezone
                    , locale: fbUser.locale
                    , updatedTime: fbUser.updated_time
                  }
                , fbProfileUrl: fbUser.link
                , bio: fbUser.bio
                , location: {
                    name: fbUser.location && fbUser.location.name ? fbUser.location.name : ''
                  }
              })

              user.save( function (err, savedUser) {
                promise.fulfill(savedUser)
              })
            })

            return promise
          }
      }
    }
})

// validations

UserSchema.path('fb.name.full').validate(function (name) {
  return name.trim().split(' ').length >= 2
}, 'Please provide your fullname')

UserSchema.path('fb.email').validate(function (email) {
  return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(email)
}, 'Please provide a proper email')


// virtual attributes

var exports = module.exports = User = mongoose.model('User', UserSchema)
