const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

let chatHistorySchema = new mongoose.Schema(
	{
		sender: { type: ObjectId, required: true, ref: 'User' },
		recipient: { type: ObjectId, required: true, ref: 'User' },
		message: { type: String },
		time: { type: Date, default: Date.now },
		roomId: { type: String },
	},
	{ collection: 'chat_history' }
);

module.exports = mongoose.model('chatHistory', chatHistorySchema);
