const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

let friendSchema = new mongoose.Schema(
	{
		userId: { type: ObjectId, required: true, ref: 'user' },
		friendId: { type: ObjectId, required: true, ref: 'user' },
		status: { type: Number },
	},
	{ collection: 'friend_map' }
);

module.exports = mongoose.model('Friend', friendSchema);
