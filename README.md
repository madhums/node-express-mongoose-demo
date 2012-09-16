**Blog post 1:** [Breaking down app.js file - nodejs, express, mongoose](http://madhums.tumblr.com/post/27521420404/breaking-down-app-js-file-nodejs-express-mongoose)

**Blog post 2:** Coming soon!

This is a boilerplate node.js application illustrating various features used in everyday
web development, with a fine touch of best practices. The demo app is a blog application
where users (signing up using facebook, twitter, github and simple registrations) can create
an article, delete an article and add comment on the article.

**Note:** You need to have node.js and mongodb installed and running

## Install
```sh
  $ git clone git://github.com/qed42/nodejs-express-mongoose-demo.git
  $ npm install
  $ cp config/config.example.js config/config.js
  $ npm start
```

**NOTE:** Do not forget to update your facebook twitter and github APP_ID and APP_SECRET in `config/config.js`

Then visit [http://localhost:3000/](http://localhost:3000/)

## Directory structure
```
-app
  |__controllers
  |__models
  |__views
-config
  |__routes
  |__config
  |__passport (auth config)
```

If you are looking for a specific feature, please use the issue tracker. I will try to come
up with a demo as earliest as I can. Please feel free to fork and send updates :)
