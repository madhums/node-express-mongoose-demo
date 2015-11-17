'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const should = require('should');
const request = require('supertest');
const app = require('../server');
const User = mongoose.model('User');

let count;

/**
 * Users tests
 */

describe('Users', function () {
  describe('POST /users', function () {
    describe('Invalid parameters', function () {
      before(function (done) {
        User.count(function (err, cnt) {
          count = cnt;
          done(err);
        });
      });

      it('no email - should respond with errors', function (done) {
        request(app)
        .post('/users')
        .field('name', 'Foo bar')
        .field('username', 'foobar')
        .field('email', '')
        .field('password', 'foobar')
        .expect('Content-Type', /html/)
        .expect(200)
        // .expect(/Email cannot be blank/)
        .end(done);
      });

      it('no name - should respond with errors', function (done) {
        request(app)
        .post('/users')
        .field('name', '')
        .field('username', 'foobar')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .expect('Content-Type', /html/)
        .expect(200)
        // .expect(/Name cannot be blank/)
        .end(done);
      });

      it('should not save the user to the database', function (done) {
        User.count(function (err, cnt) {
          count.should.equal(cnt);
          done(err);
        });
      });
    });

    describe('Valid parameters', function () {
      before(function (done) {
        User.count(function (err, cnt) {
          count = cnt;
          done();
        });
      });

      it('should redirect to /articles', function (done) {
        request(app)
        .post('/users')
        .field('name', 'Foo bar')
        .field('username', 'foobar')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .expect('Content-Type', /plain/)
        .expect('Location', /\//)
        .expect(302)
        .expect(/Moved Temporarily/)
        .end(done);
      });

      it('should insert a record to the database', function (done) {
        User.count(function (err, cnt) {
          cnt.should.equal(count + 1);
          done(err);
        });
      });

      it('should save the user to the database', function (done) {
        User.findOne({ username: 'foobar' }).exec(function (err, user) {
          should.not.exist(err);
          user.should.be.an.instanceOf(User);
          user.email.should.equal('foobar@example.com');
          done();
        });
      });
    });
  });

  after(function (done) {
    require('./helper').clearDb(done);
  });
});
