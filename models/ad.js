var mongoose = require("mongoose");
var passportlocalmongoose = require("passport-local-mongoose");


var ProductSchema = new mongoose.Schema({
	userid:String,
	name:String,
	title:String,
	price:String,
	add:String,
	mob:String,
	desc:String,
	type:String,
	class:String

});
module.exports = mongoose.model("Product",ProductSchema);