const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

let postSchema = new mongoose.Schema(
	{
		userId: {
			type: ObjectId,
			required: true,
			ref: 'user',
		},
		img_url: {
			type: String,
			required: true,
		},
		caption: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		lat: {
			type: Number,
		},
		lng: {
			type: Number,
		},
	},
	{ collection: 'posts' }
);

module.exports = mongoose.model('Post', postSchema);
