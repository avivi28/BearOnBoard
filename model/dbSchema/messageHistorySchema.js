const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

let chatHistorySchema = new mongoose.Schema(
	{
		sender: { type: ObjectId, required: true, ref: 'User' },
		recipient: { type: ObjectId, required: true, ref: 'User' },
		message: { type: String },
		order: { type: Date, default: Date.now },
		time: { type: String },
		roomId: { type: String, ref: 'Chatroom' },
	},
	{ collection: 'message_history' }
);

module.exports = mongoose.model('chatHistory', chatHistorySchema);
