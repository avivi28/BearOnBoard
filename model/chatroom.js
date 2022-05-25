const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const chatHistory = require('./dbSchema/chatHistorySchema.js');

//---------------get or create chat room number-----------------
router.get('/', async (req, res) => {
	const userInfo = {
		sender: ObjectId(req.query.sender),
		recipient: ObjectId(req.query.recipient),
	};
	const anotherUserInfo = {
		sender: ObjectId(req.query.recipient),
		recipient: ObjectId(req.query.sender),
	};
	const chatroomHistory = await chatHistory.findOne(userInfo);
	const anotherChatroomHistory = await chatHistory.findOne(anotherUserInfo);
	if (chatroomHistory == null && anotherChatroomHistory == null) {
		const roomNumber = uuidv4();
		const room = new chatHistory({
			sender: ObjectId(req.query.sender),
			recipient: ObjectId(req.query.recipient),
			roomId: roomNumber,
		});
		const newRoomResult = await room.save();
		res.json(newRoomResult);
	} else if (chatroomHistory == null) {
		res.json(anotherChatroomHistory);
	} else {
		res.json(chatroomHistory);
	}
});

//-----------get padding list OR friends list-------------
router.post('/', async (req, res) => {
	const room = new chatHistory({
		sender: req.body.sender,
		recipient: req.body.recipient,
		message: req.body.message,
		time: req.body.time,
		roomId: req.body.roomId,
	});
	await room.save();
	res.json({ ok: true });
});

module.exports = router;
