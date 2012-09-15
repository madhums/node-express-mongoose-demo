// comment schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var CommentSchema = new Schema({
    body        : {type : String, default : ''}
  , user        : {type : Schema.ObjectId, ref : 'User'}
  , created_at  : {type : Date, default : Date.now}
})

mongoose.model('Comment', CommentSchema)
