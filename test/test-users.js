
/**
 * Module dependencies.
 */

require('./helper.js')

var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../server')
  , async = require('async')

var cookies
var count
var User = mongoose.model('User')

/**
 * Users tests
 */

describe('Users', function () {

  describe('POST /users', function () {
    describe('Invalid parameters', function () {
      before(function (done) {
        User.count(function (err, cnt) {
          count = cnt
          done()
        })
      })

      it('no email - should respond with errors', function (done) {
        request(app)
        .post('/users')
        .field('name', 'Foo bar')
        .field('username', 'foobar')
        .field('email', '')
        .field('password', 'foobar')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(/Email cannot be blank/)
        .end(done)
      })

      it('should not save the user to the database', function (done) {
        User.count(function (err, cnt) {
          count.should.equal(cnt)
          done()
        })
      })
    })
  })

  after(function (done) {
    var User = mongoose.model('User')
    User.find().exec(function (err, users) {
      var callback = function (user, fn) { user.remove(fn) }
      async.forEach(users, callback, done)
    })
  })

})
