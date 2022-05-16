const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

let friendSchema = new mongoose.Schema(
	{
		sender: { type: ObjectId, required: true, ref: 'User' },
		recipient: { type: ObjectId, required: true, ref: 'User' },
		status: { type: Number },
	},
	{ collection: 'friend_map' }
);

module.exports = mongoose.model('Friend', friendSchema);
