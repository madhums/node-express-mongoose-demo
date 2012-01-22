// Article schema

var ArticleSchema = new Schema({
    title       : {type : String, default : '', trim : true}
  , body        : {type : String, default : '', trim : true}
  , user        : {type : Schema.ObjectId, ref : 'User'}
  , created_at  : {type : Date, default : Date.now}
})

ArticleSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'Article title cannot be blank')

ArticleSchema.path('body').validate(function (body) {
  return body.length > 0
}, 'Article body cannot be blank')


mongoose.model('Article', ArticleSchema)
