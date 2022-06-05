const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

const User = require('./dbSchema/userSchema.js');
const Friend = require('./dbSchema/friendSchema.js');

//-----------get padding list OR friends list-------------
router.get('/', async (req, res) => {
	try {
		const friendInfo = {
			recipient: ObjectId(req.query.userId),
			status: req.query.status,
		};
		const friendResult = await Friend.find(friendInfo).populate({
			path: 'sender',
			select: 'name',
		});
		res.json(friendResult);
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
});

//---------accept or reject friend request API-------------
router.put('/', async (req, res) => {
	try {
		const friendInfo = {
			sender: ObjectId(req.body.friendId),
			recipient: ObjectId(req.body.userId),
		};
		const userInfo = {
			sender: ObjectId(req.body.userId),
			recipient: ObjectId(req.body.friendId),
		};
		const statusUpdate = {
			status: req.body.status, //1:accept 0:panding
		};
		await Friend.findOneAndUpdate(userInfo, statusUpdate, {
			new: true,
		});
		await Friend.findOneAndUpdate(friendInfo, statusUpdate, {
			new: true,
		}); //(filter,update)
		await User.findOneAndUpdate(
			{
				_id: ObjectId(req.body.userId),
			},
			{ $push: { friends: ObjectId(req.body.friendId) } }
		); //add friend's id into User schema
		await User.findOneAndUpdate(
			{
				_id: ObjectId(req.body.friendId),
			},
			{ $push: { friends: ObjectId(req.body.userId) } }
		);
		res.json({ ok: true });
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
});

//---------search engine of friend's name API-------------
router.patch('/', async (req, res) => {
	try {
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
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
});

//---------successfully add as friends API-------------
router.post('/', async (req, res) => {
	try {
		const repeatedUserRequest = {
			sender: ObjectId(req.body.userId),
			recipient: ObjectId(req.body.friendId),
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
		const checkedResult = await Friend.find({
			$or: [repeatedUserRequest, addedUserRequest, addedFriendRequest],
		});
		if (checkedResult.length === 0) {
			const userInfo = {
				sender: ObjectId(req.body.userId),
				recipient: ObjectId(req.body.friendId),
				status: 0, //panding
			};
			const newRequest = new Friend(userInfo);
			await newRequest.save();
			res.json({ ok: true });
		} else {
			res.json({ error: true, message: 'repeated requests' });
		}
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
});

//---------delete friends API-------------
router.delete('/', async (req, res) => {
	try {
		await Friend.findOneAndDelete({
			sender: ObjectId(req.body.userId),
			recipient: ObjectId(req.body.friendId),
			status: 1,
		});
		await Friend.findOneAndDelete({
			sender: ObjectId(req.body.friendId),
			recipient: ObjectId(req.body.userId),
			status: 1,
		});
		await User.findOneAndUpdate(
			{
				_id: ObjectId(req.body.userId),
			},
			{ $pull: { friends: ObjectId(req.body.friendId) } }
		);
		await User.findOneAndUpdate(
			{
				_id: ObjectId(req.body.friendId),
			},
			{ $pull: { friends: ObjectId(req.body.userId) } }
		);
		res.json({ ok: true });
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
});

module.exports = router;
