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
		post: [{ type: ObjectId, ref: 'Post' }],
		friend: [{ type: ObjectId, ref: 'Friend' }],
	},
	{ collection: 'user' }
);

module.exports = mongoose.model('User', userSchema);
