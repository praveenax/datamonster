var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// make this available to our users in our Node applications

var HTMLArchiveSchema = mongoose.Schema({
  url: String,
  version:Number,
  path:String
});


var HTMLModel = mongoose.model('HTMLModel', HTMLArchiveSchema);

module.exports = HTMLModel;
