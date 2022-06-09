const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

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
		friends: [{ type: ObjectId, ref: 'User' }],
	},
	{ collection: 'user' }
);

module.exports = mongoose.model('User', userSchema);
