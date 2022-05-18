const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const jwt_decode = require('jwt-decode');

const Post = require('./dbSchema/postSchema.js');

router.get('/', async (req, res) => {
	const JWTcookies = req.cookies['token'];
	const decoded = jwt_decode(JWTcookies);
	const userId = decoded['userId'];
	const userInfo = {
		userId: ObjectId(userId),
	};
	const locationResult = await Post.find(userInfo);
	res.json(locationResult);
});

router.get('/:friendId', async (req, res) => {
	const friendId = ObjectId(req.params.friendId);
	const result = await Post.find({ userId: friendId });
	res.json(result);
});

router.post('/', async (req, res) => {
	const postInfo = {
		userId: req.body.userId,
		img_url: req.body.img_url,
		caption: req.body.caption,
		location: req.body.location,
		lat: req.body.lat,
		lng: req.body.lng,
	};
	const post = new Post(postInfo);
	await post.save();
	res.json({ lat: req.body.lat, lng: req.body.lng });
});

module.exports = router;
