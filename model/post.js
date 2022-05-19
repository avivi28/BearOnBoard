const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const jwt_decode = require('jwt-decode');

const Post = require('./dbSchema/postSchema.js');
const Comment = require('./dbSchema/commentSchema.js');

//------------get user's posts API--------------
router.get('/', async (req, res) => {
	const JWTcookies = req.cookies['token'];
	const decoded = jwt_decode(JWTcookies);
	const userId = decoded['userId'];
	const locationResult = await Post.find({
		userId: ObjectId(userId),
	});
	res.json(locationResult);
});

//------------get friends' posts API--------------
router.get('/:friendId', async (req, res) => {
	const result = await Post.find({ userId: ObjectId(req.params.friendId) });
	res.json(result);
});

//-------------posts' likes API---------------
router.put('/', async (req, res) => {
	try {
		const duplicatedInput = await Post.findOne({
			_id: ObjectId(req.body.postId),
			likes: ObjectId(req.body.userId),
		});
		if (duplicatedInput == null) {
			await Post.findOneAndUpdate(
				{
					_id: ObjectId(req.body.postId),
				},
				{ $push: { likes: ObjectId(req.body.userId) } }
			);
			res.json({ ok: true });
		} else {
			await Post.findOneAndUpdate(
				{
					_id: ObjectId(req.body.postId),
				},
				{ $pull: { likes: ObjectId(req.body.userId) } }
			);
			res.json({ error: true, message: 'duplicated request' });
		}
	} catch (error) {
		res.json({ error: true, message: 'system error' });
	}
});

//-----------upload new posts API-------------
router.post('/', async (req, res) => {
	const post = new Post({
		userId: req.body.userId,
		img_url: req.body.img_url,
		caption: req.body.caption,
		location: req.body.location,
		lat: req.body.lat,
		lng: req.body.lng,
	});
	await post.save();
	res.json({ lat: req.body.lat, lng: req.body.lng });
});

module.exports = router;
