var common = {
    appName: 'Node.js Express Mongoose Demo'
  , company: 'Company'
  , company_url: 'http://example.com'
  
}
module.exports = {
    development: {
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: common.appName
      },
      common: common,
      db: 'mongodb://localhost/noobjs_dev',
      facebook: {
          clientID: "APP_ID"
        , clientSecret: "APP_SECRET"
        , callbackURL: "http://localhost:3000/auth/facebook/callback"
      },
      twitter: {
          clientID: "CONSUMER_KEY"
        , clientSecret: "CONSUMER_SECRET"
        , callbackURL: "http://localhost:3000/auth/twitter/callback"
      },
      github: {
          clientID: 'APP_ID'
        , clientSecret: 'APP_SECRET'
        , callbackURL: 'http://localhost:3000/auth/github/callback'
      },
      google: {
          clientID: "APP_ID"
        , clientSecret: "APP_SECRET"
        , callbackURL: "http://localhost:3000/auth/google/callback"
      }
    }
  , test: {

    }
  , production: {

    }
}
