const mongoose = require('mongoose');

let userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		password: {
			type: String,
		},
	},
	{ collection: 'user' }
);

module.exports = mongoose.model('User', userSchema);
