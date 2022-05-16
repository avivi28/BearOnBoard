const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

const User = require('./dbSchema/userSchema.js');
const Friend = require('./dbSchema/friendSchema.js');

//-----------get padding list OR friends list-------------
router.get('/', async (req, res) => {
	const friendInfo = {
		recipient: ObjectId(req.query.userId),
		status: req.query.status,
	};
	const friendResult = await Friend.find(friendInfo).populate({
		path: 'sender',
		select: 'name',
	});
	res.json(friendResult);
});

//---------accept or reject friend request API-------------
router.put('/', async (req, res) => {
	const friendInfo = {
		sender: ObjectId(req.body.friendId),
		recipient: ObjectId(req.body.userId),
	};
	const userInfo = {
		sender: ObjectId(req.body.userId),
		recipient: ObjectId(req.body.friendId),
	};
	const statusUpdate = {
		status: req.body.status, //1:accept 0:reject}
	};
	await Friend.findOneAndUpdate(userInfo, statusUpdate, {
		new: true,
	});
	await Friend.findOneAndUpdate(friendInfo, statusUpdate, {
		new: true,
	}); //(filter,update)
	res.json({ ok: true });
});

//---------search engine of friend's name API-------------
router.patch('/', async (req, res) => {
	const payload = req.body.payload.trim(); //trim():remove all whitespace
	let search = await User.find({
		name: { $regex: new RegExp('^' + payload + '.*', 'i') },
	})
		.select({
			name: 1,
			_id: 0,
		}) //return name field only
		.exec();
	//Limit search results to 10
	search = search.slice(0, 10);
	res.send({ payload: search });
});

//---------successfully add as friends API-------------
router.post('/', async (req, res) => {
	const repeatedUserRequest = {
		sender: ObjectId(req.body.userId),
		recipient: ObjectId(req.body.friendId),
		status: 0,
	};
	const repeatedFriendRequest = {
		sender: ObjectId(req.body.friendId),
		recipient: ObjectId(req.body.userId),
		status: 0,
	};
	const addedUserRequest = {
		sender: ObjectId(req.body.userId),
		recipient: ObjectId(req.body.friendId),
		status: 1,
	};
	const addedFriendRequest = {
		sender: ObjectId(req.body.friendId),
		recipient: ObjectId(req.body.userId),
		status: 1,
	};
	const checkedResult = await Friend.findOne({
		$or: [
			repeatedUserRequest,
			repeatedFriendRequest,
			addedUserRequest,
			addedFriendRequest,
		],
	});
	if (checkedResult == null) {
		const userInfo = {
			sender: ObjectId(req.body.userId),
			recipient: ObjectId(req.body.friendId),
			status: 0, //panding
		};
		const friendInfo = {
			sender: ObjectId(req.body.friendId),
			recipient: ObjectId(req.body.userId),
			status: 0, //panding
		};
		await Friend.insertMany([userInfo, friendInfo]);
		res.json({ ok: true });
	} else {
		res.json({ error: true, message: 'repeated request' });
	}
});

module.exports = router;
