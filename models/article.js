require('./db_connect');

// Article schema

var Article = new Schema({
  title       : {type : String, default : '', required : true},
  body        : {type : String, default : ''},
  comments    : [{ type: Schema.ObjectId, ref: 'Comment' }],
  created_at  : {type : Date, default : Date.now},
  updated_at  : {type : Date, default : Date.now}
});

var exports = module.exports = mongoose.model('Article', Article);
