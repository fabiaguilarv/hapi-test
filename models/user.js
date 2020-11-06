const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var conn =mongoose.Collection;
var userSchema =new mongoose.Schema({
	email: String,
	password:String,
	client_user_id: String,
	client_secret: String,
	type: String
});

var userModel = mongoose.model('User', userSchema);
module.exports=userModel;
