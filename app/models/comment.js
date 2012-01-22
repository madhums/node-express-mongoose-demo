// comment schema

var Comments = new Schema({
  body        : {type : String, default : ''},
  article     : {type : Schema.ObjectId, ref : 'Article'},
  created_at  : {type : Date, default : Date.now},
  updated_at  : {type : Date, default : Date.now}
});

mongoose.model('Comment', Comments);
