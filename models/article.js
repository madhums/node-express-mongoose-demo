var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/noobjs');
    Schema = mongoose.Schema;

// Article schema

var ArticleSchema = new Schema({
  title       : {type : String, default : '', required : true},
  body        : {type : String, default : ''},
  created_at  : {type : Date, default : Date.now},
  updated_at  : {type : Date, default : Date.now}
});
  
var exports = module.exports = mongoose.model('Article', ArticleSchema);
