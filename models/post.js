var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
	nick: {type: String, required:true},
	title: {type: String, required:true},
	body: {type: String, required:true},
});

module.exports = mongoose.model('Post', postSchema);