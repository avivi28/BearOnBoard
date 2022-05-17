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
		friends: [{ type: ObjectId, ref: 'User' }],
		bios: { type: String },
	},
	{ collection: 'user' }
);

module.exports = mongoose.model('User', userSchema);
