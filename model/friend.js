const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

const User = require('./dbSchema/userSchema.js');
const Friend = require('./dbSchema/friendSchema.js');

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
	const repeatedResult = {
		userId: ObjectId(req.body.userId),
		friendId: ObjectId(req.body.friendId),
	};
	const checkedResult = await Friend.findOne(repeatedResult);
	if (checkedResult == null) {
		const friendInfo = {
			userId: ObjectId(req.body.userId),
			friendId: ObjectId(req.body.friendId),
			status: 0, //panding
		};
		const friend = new Friend(friendInfo);
		await friend.save();
		res.json({ ok: true });
	} else {
		res.json({ error: true, message: 'repeated request' });
	}
});

module.exports = router;
