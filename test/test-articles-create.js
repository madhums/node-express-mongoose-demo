'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const test = require('ava');
const request = require('supertest');
const app = require('../server');
const cleanup = require('./helper').cleanup;
const User = mongoose.model('User');
const Article = mongoose.model('Article');
const agent = request.agent(app);

const _user = {
  email: 'foobar@example.com',
  name: 'Foo bar',
  username: 'foobar',
  password: 'foobar'
};

test.beforeEach(t => cleanup(t.end));

test('POST /articles - when not logged in - should redirect to /login', t => {
  request(app)
  .get('/articles/new')
  .expect('Content-Type', /plain/)
  .expect(302)
  .expect('Location', '/login')
  .expect(/Redirecting/)
  .end(t.end);
});

// user login
test.before(async t => {
  const user = new User(_user);
  await user.save();

  agent
  .post('/users/session')
  .field('email', _user.email)
  .field('password', _user.password)
  .expect('Location', '/')
  .expect('Content-Type', /html/)
  .end(err => {
    console.log(err);
    t.ifError(err);
    t.end(err);
  });
});

test('POST /articles - invalid form - should respond with error', t => {
  agent
  .post('/articles')
  .field('title', '')
  .field('body', 'foo')
  .expect('Content-Type', /text/)
  .expect(302)
  .expect(/Article title cannot be blank/)
  .end(async (err, res) => {
    const count = await Article.count().exec();
    t.ifError(err);
    t.same(count, 0, 'Count should be 0');
    t.end();
  });
});

test('POST /articles - valid form - should redirect to the new article page', t => {
  agent
  .post('/articles')
  .field('title', 'foo')
  .field('body', 'bar')
  .expect('Content-Type', /plain/)
  .expect('Location', /\/articles\//)
  .expect(302)
  .expect(/Redirecting/)
  .end(async err => {
    const count = await Article.count().exec();
    t.ifError(err);
    t.same(count, 1, 'Count should be 0');
    t.end();
  });
});

test.afterEach(t => cleanup(t.end));
