var mongoose = require("mongoose");

var imgSchema = new mongoose.Schema({

	img: { data: Buffer, contentType: String }
});
module.exports = mongoose.model("Img",imgSchema);