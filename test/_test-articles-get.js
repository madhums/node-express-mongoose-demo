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

test.beforeEach(t => cleanup(t.end));

test('GET /articles - should respond with Content-Type text/html', t => {
  agent
  .get('/articles')
  .expect('Content-Type', /html/)
  .expect(200)
  .expect(/Articles/)
  .end(t.end);
});

test('GET /articles/new - When not logged in - should redirect to /login', t => {
  agent
  .get('/articles/new')
  .expect('Content-Type', /plain/)
  .expect(302)
  .expect('Location', '/login')
  .expect(/Moved Temporarily/)
  .end(t.end);
});

test.before(t => {
  // login the user
  agent
  .post('/users/session')
  .field('email', 'foobar@example.com')
  .field('password', 'foobar')
  .end(t.end);
});

test('GET /articles/new - When logged in - should respond with Content-Type text/html', t => {
  agent
  .get('/articles/new')
  .expect('Content-Type', /html/)
  .expect(200)
  .expect(/New Article/)
  .end(t.end);
});

