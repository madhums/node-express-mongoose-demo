**Blog post 1:** [Breaking down app.js file - nodejs, express, mongoose](http://madhums.me/2012/07/19/breaking-down-app-js-file-nodejs-express-mongoose/)

**Blog post 2:** Coming soon!

This is a boilerplate node.js application illustrating various features used in everyday
web development, with a fine touch of best practices. The demo app is a blog application
where users (signing up using facebook, twitter, github and simple registrations) can create
an article, delete an article and add comment on the article.

**Note:** You need to have node.js and mongodb installed and running

## Install
```sh
  $ git clone git://github.com/madhums/nodejs-express-mongoose-demo.git
  $ npm install
  $ cp config/config.example.js config/config.js
  $ npm start
```

**NOTE:** Do not forget to update your facebook twitter and github APP_ID and APP_SECRET in `config/config.js`

Then visit [http://localhost:3000/](http://localhost:3000/)

## Directory structure
```
-app/
  |__controllers/
  |__models/
  |__views/
-config/
  |__routes.js
  |__config.js
  |__passport.js (auth config)
```

If you are looking for a specific feature, please use the issue tracker. I will try to come
up with a demo as earliest as I can. Please feel free to fork and send updates :)

---

## License
(The MIT License)

Copyright (c) 2012 Madhusudhan Srinivasa < [madhums8@gmail.com](mailto:madhums8@gmail.com) >

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
