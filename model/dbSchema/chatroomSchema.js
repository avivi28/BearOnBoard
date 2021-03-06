const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

let chatroomSchema = new mongoose.Schema(
	{
		sender: { type: ObjectId, required: true, ref: 'User' },
		recipient: { type: ObjectId, required: true, ref: 'User' },
		roomId: { type: String },
	},
	{ collection: 'chatroom' }
);

module.exports = mongoose.model('Chatroom', chatroomSchema);
