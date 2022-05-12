const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

const insertOne = require('./mongodb').insertOne;
const queryOne = require('./mongodb').queryOne;

const table = 'posts';

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
	res.json({ ok: true });
});

module.exports = router;
