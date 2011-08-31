var fs = require('fs');
exports = mongoose = require('mongoose');
var environment = process.env.NODE_ENV || 'development'
var mongo_uri = JSON.parse( fs.readFileSync(process.cwd()+'/config.json', encoding='utf8') )[environment].mongo_uri;
mongoose.connect(mongo_uri);
exports = Schema = mongoose.Schema;
