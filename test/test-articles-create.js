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

const _user = {
  email: 'foo@email.com',
  name: 'Foo bar',
  username: 'foobar',
  password: 'foobar'
};


test.before(cleanup);
test.beforeEach(cleanup);


// user login
test.beforeEach(async t => {
  const ctx = global.Promise.defer();
  const agent = request.agent(app);
  const user = new User(_user);

  user.save().then(() => {
    agent
    .post('/users/session')
    .field('email', _user.email)
    .field('password', _user.password)
    .expect('Location', '/')
    .expect('Content-Type', /text/)
    .end((err, res) => {
      ctx.resolve(res.headers['set-cookie']);
    });
  });

  t.context.agent = agent;
  t.context.cookie = await ctx.promise;
  t.end();
});


test('POST /articles - when not logged in - should redirect to /login', t => {
  request(app)
  .get('/articles/new')
  .expect('Content-Type', /plain/)
  .expect(302)
  .expect('Location', '/login')
  .expect(/Redirecting/)
  .end(t.end);
});


test('POST /articles - invalid form - should respond with error', t => {
  t.context.agent
  .post('/articles')
  .field('title', '')
  .field('body', 'foo')
  .set('cookie', t.context.cookie)
  .expect('Content-Type', /text/)
  .expect(302)
  .expect(/Article title cannot be blank/)
  .end(async err => {
    const count = await Article.count().exec();
    t.ifError(err);
    t.same(count, 0, 'Count should be 0');
    t.end();
  });
});


test('POST /articles - valid form - should redirect to the new article page', t => {
  t.context.agent
  .post('/articles')
  .field('title', 'foo')
  .field('body', 'bar')
  .set('cookie', t.context.cookie)
  .expect('Content-Type', /plain/)
  .expect('Location', /\/articles\//)
  .expect(302)
  .expect(/Redirecting/)
  .end(async err => {
    const count = await Article.count().exec();
    t.ifError(err);
    t.same(count, 1, 'Count should be 1');
    t.end();
  });
});
