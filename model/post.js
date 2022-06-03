const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const jwt_decode = require('jwt-decode');
const { redisClient } = require('../redis');

const Post = require('./dbSchema/postSchema.js');

//------------get user's posts API--------------
router.get('/', async (req, res) => {
	try {
		const JWTcookies = req.cookies['token'];
		const decoded = jwt_decode(JWTcookies);
		const userId = decoded['userId'];

		// Get from cache using the "Key"
		const getRes = await redisClient.get(userId);
		if (getRes) {
			return res.json(JSON.parse(getRes));
		} else {
			// On cache-miss => query database
			const locationResult = await Post.find({
				userId: ObjectId(userId),
			});

			// Set cache
			await redisClient.setEx(userId, 3600, JSON.stringify(locationResult));
			return res.json(locationResult);
		}
	} catch (e) {
		console.log(e);
		res.status(500).json({ error: true, message: 'server error' });
	}
});

//------------get friends' posts API--------------
router.get('/:friendId', async (req, res) => {
	try {
		const result = await Post.find({ userId: ObjectId(req.params.friendId) });
		res.json(result);
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
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
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
});

//-----------upload new posts API-------------
router.post('/', async (req, res) => {
	try {
		const JWTcookies = req.cookies['token'];
		const decoded = jwt_decode(JWTcookies);
		const userId = decoded['userId'];
		await redisClient.del(userId);

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
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
});

module.exports = router;
