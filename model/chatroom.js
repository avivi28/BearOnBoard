const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { redisClient, chatroomQueue } = require('../redis');

const Chatroom = require('./dbSchema/chatroomSchema.js');
const chatHistory = require('./dbSchema/messageHistorySchema.js');

//---------------get or create chat room number-----------------
router.get('/', async (req, res) => {
	try {
		const userInfo = {
			sender: ObjectId(req.query.sender),
			recipient: ObjectId(req.query.recipient),
		};
		const anotherUserInfo = {
			sender: ObjectId(req.query.recipient),
			recipient: ObjectId(req.query.sender),
		};
		const chatroomHistory = await Chatroom.findOne(userInfo);
		const anotherChatroomHistory = await Chatroom.findOne(anotherUserInfo);
		if (chatroomHistory == null && anotherChatroomHistory == null) {
			const roomNumber = uuidv4();
			const room = new Chatroom({
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
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
});

//---------------get history message-----------------
router.put('/', async (req, res) => {
	try {
		const count = req.body.count * 6;
		const roomId = req.body.roomId;

		const chatroomHistory = await chatHistory
			.find({
				roomId: roomId,
			})
			.sort([['order', -1]])
			.populate({
				path: 'sender',
				select: 'name',
			})
			.skip(count)
			.limit(6);

		return res.json(chatroomHistory);
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
});

//-----------save history message into database-------------
router.post('/', async (req, res) => {
	try {
		const room = await new chatHistory({
			sender: req.body.sender,
			recipient: req.body.recipient,
			message: req.body.message,
			time: req.body.time,
			roomId: req.body.roomId,
		});
		await room.save();
		// const main = async () => {
		// 	await chatroomQueue.add({
		// 		sender: req.body.sender,
		// 		recipient: req.body.recipient,
		// 		message: req.body.message,
		// 		time: req.body.time,
		// 		roomId: req.body.roomId,
		// 	});
		// };

		// const job = await chatroomQueue.add({
		// 	sender: req.body.sender,
		// 	recipient: req.body.recipient,
		// 	message: req.body.message,
		// 	time: req.body.time,
		// 	roomId: req.body.roomId,
		// });

		// chatroomQueue.process(async (job) => {
		// 	let progress = 0;
		// 	for (i = 0; i < 100; i++) {
		// 		const room = await new chatHistory(job.data);
		// 		await room.save();
		// 		progress += 10;
		// 		job.progress(progress);
		// 	}
		// });

		// chatroomQueue.on('completed', (job) => {
		// 	console.log(`Job with id ${job.id} has been completed`);
		// });
		res.json({ ok: true });
	} catch (e) {
		res.status(500).json({
			error: true,
			message: 'server error',
		});
	}
});

module.exports = router;
