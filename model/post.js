const express = require('express');
const router = express.Router();

const insertOne = require('./mongodb').insertOne;
const queryOne = require('./mongodb').queryOne;

const table = 'posts';

router.get('/', async (req, res) => {
	const img_url = req.params.img;
	const caption = req.params.caption;
	const location = req.params.location;
});

module.exports = router;
