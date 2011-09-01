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
  },
  appName: function(req, res){ return 'node.js express demo'  }
});

// Include all routes here

require('./routes/articles')(app)

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express app started on port '+port);
