// user schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var UserSchema = new Schema({
    name: String
  , email: String
  , username: String
  , provider: String
  , facebook: {}
  , twitter: {}
  , github: {}
})

// virtual attributes

mongoose.model('User', UserSchema)
