require('./db_connect');

// comment schema

var Comments = new Schema({
  body        : {type : String, default : ''},
  created_at  : {type : Date, default : Date.now},
  updated_at  : {type : Date, default : Date.now}
});

var exports = module.exports = mongoose.model('Comment', Comments);
