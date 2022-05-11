const express = require('express');
const router = express.Router();

const insertOne = require('./mongodb').insertOne;
const queryOne = require('./mongodb').queryOne;

const table = 'posts';

router.post('/', async (req, res) => {
	const postInfo = {
		img_url: req.body.img_url,
		caption: req.body.caption,
		location: req.body.locatio,
	};
	const result = await insertOne(table, postInfo);
	res.json(result);
});

module.exports = router;
