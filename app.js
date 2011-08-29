var express = require('express');
var app     = express.createServer();

require('./settings').boot(app);

app.dynamicHelpers({
  base: function(){
    // return the app's mount-point
    // so that urls can adjust. For example
    // if you run this example /post/add works
    // however if you run the mounting example
    // it adjusts to /blog/post/add
    return '/' == app.route ? '' : app.route;
  }
});

// Include all routes here

require('./routes/articles')(app)

app.listen(app.settings.env.port);
console.log('Express app started on port '+app.settings.env.port);
