const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const jwt_decode = require('jwt-decode');

const insertOne = require('./mongodb').insertOne;
const queryMany = require('./mongodb').queryMany;

const table = 'posts';

router.get('/', async (req, res) => {
	const JWTcookies = req.cookies['token'];
	const decoded = jwt_decode(JWTcookies);
	const userId = decoded['userId'];
	const userInfo = {
		userId: ObjectId(userId),
	};
	const locationResult = await queryMany(table, userInfo);
	res.json(locationResult);
});

router.post('/', async (req, res) => {
	const postInfo = {
		userId: ObjectId(req.body.userId),
		img_url: req.body.img_url,
		caption: req.body.caption,
		location: req.body.location,
		lat: req.body.lat,
		lng: req.body.lng,
	};
	await insertOne(table, postInfo);
	res.json({ lat: req.body.lat, lng: req.body.lng });
});

module.exports = router;
