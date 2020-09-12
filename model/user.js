const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
	firstname: {
		type: String
	},
	lastname: {
		type: String
	},
	email: { 
		type: String
	},
	phonenumber: {
		type: String
	},
	image: {
		type: String
	}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);