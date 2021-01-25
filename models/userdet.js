var mongoose = require("mongoose");

var userDetSchema = new mongoose.Schema({

	userid:String,
	name:String,
	mobno:String,
	dob:String
});
module.exports = mongoose.model("Userdet",userDetSchema);