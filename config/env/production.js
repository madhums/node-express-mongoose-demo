'use strict';

/**
 * Expose
 */

module.exports = {
  db: process.env.MONGODB_URL,
  twitter: {
    clientID: process.env.TWITTER_CLIENTID,
    clientSecret: process.env.TWITTER_SECRET,
    callbackURL:
      'https://nodejs-express-demo.fly.dev/auth/twitter/callback/'
  },
  github: {
    clientID: process.env.GITHUB_CLIENTID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL:
      'https://nodejs-express-demo.fly.dev/auth/github/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_CLIENTID,
    clientSecret: process.env.LINKEDIN_SECRET,
    callbackURL:
      'https://nodejs-express-demo.fly.dev/auth/linkedin/callback'
  },
  google: {
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL:
      'https://nodejs-express-demo.fly.dev/auth/google/callback'
  }
};
