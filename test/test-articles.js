
/**
 * Module dependencies.
 */

// require('./helper.js')

var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../server')
  , async = require('async')

var cookies
var count
var User = mongoose.model('User')
var Article = mongoose.model('Article')

/**
 * Articles tests
 */

describe('Articles', function () {

  before(function (done) {
    // create a user
    var user = new User({
      email: 'foobar@example.com',
      name: 'Foo bar',
      username: 'foobar',
      password: 'foobar'
    })
    user.save(done)
  })

  describe('GET /articles', function () {
    it('should respond with Content-Type text/html', function (done) {
      request(app)
      .get('/articles')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(/List of Articles/)
      .end(done)
    })
  })

  describe('GET /articles/new', function () {
    describe('When not logged in', function () {
      it('should redirect to /login', function (done) {
        request(app)
        .get('/articles/new')
        .expect('Content-Type', /plain/)
        .expect(302)
        .expect('Location', '/login')
        .expect(/Moved Temporarily/)
        .end(done)
      })
    })

    describe('When logged in', function () {
      before(function (done) {
        // login the user
        request(app)
        .post('/users/session')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .end(function (err, res) {
          // store the cookie
          cookies = res.headers['set-cookie'].pop().split(';')[0];
          done()
        })
      })

      it('should respond with Content-Type text/html', function (done) {
        var req = request(app).get('/articles/new')
        req.cookies = cookies
        req
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(/New Article/)
        .end(done)
      })
    })
  })

  describe('POST /articles', function () {
    describe('When not logged in', function () {
      it('should redirect to /login', function (done) {
        request(app)
        .get('/articles/new')
        .expect('Content-Type', /plain/)
        .expect(302)
        .expect('Location', '/login')
        .expect(/Moved Temporarily/)
        .end(done)
      })
    })

    describe('When logged in', function () {
      before(function (done) {
        // login the user
        request(app)
        .post('/users/session')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .end(function (err, res) {
          // store the cookie
          cookies = res.headers['set-cookie'].pop().split(';')[0];
          done()
        })
      })

      describe('Invalid parameters', function () {
        before(function (done) {
          Article.count(function (err, cnt) {
            count = cnt
            done()
          })
        })

        it('should respond with error', function (done) {
          var req = request(app).post('/articles')
          req.cookies = cookies
          req
          .field('title', '')
          .field('body', 'foo')
          .expect('Content-Type', /html/)
          .expect(200)
          .expect(/Article title cannot be blank/)
          .end(done)
        })

        it('should not save to the database', function (done) {
          Article.count(function (err, cnt) {
            count.should.equal(cnt)
            done()
          })
        })
      })

      describe('Valid parameters', function () {
        before(function (done) {
          Article.count(function (err, cnt) {
            count = cnt
            done()
          })
        })

        it('should redirect to the new article page', function (done) {
          var req = request(app).post('/articles')
          req.cookies = cookies
          req
          .field('title', 'foo')
          .field('body', 'bar')
          .expect('Content-Type', /plain/)
          .expect('Location', /\/articles\//)
          .expect(302)
          .expect(/Moved Temporarily/)
          .end(done)
        })

        it('should save the article in the database', function (done) {
          var req = request(app).post('/articles')
          req.cookies = cookies
          req
          .field('title', 'article 2')
          .field('body', 'test body')
          .end(function (err, res) {
            Article.count(function (err, cnt) {
              cnt.should.equal(count + 2)
              done()
            })
          })
        })
      })
    })
  })

  after(function (done) {
    var callback = function (item, fn) { item.remove(fn) }

    async.parallel([
      function (cb) {
        User.find().exec(function (err, users) {
          async.forEach(users, callback, cb)
        })
      },
      function (cb) {
        Article.find().exec(function (err, articles) {
          async.forEach(articles, callback, cb)
        })
      }
    ], done)
  })
})
