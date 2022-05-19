const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

let commentSchema = new mongoose.Schema(
	{
		comment: {
			type: String,
			trim: true, //without spacing
			required: true,
		},
		date: {
			type: Date,
			default: Date.now,
		},
		commenter: { type: ObjectId, required: true, ref: 'User' },
		postId: {
			type: ObjectId,
			required: true,
			ref: 'Post',
		},
	},
	{ collection: 'comments' }
);

module.exports = mongoose.model('Comment', commentSchema);
