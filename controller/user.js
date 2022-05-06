const express = require('express');
const insertOne = require('../model/mongodb').insertOne;
const queryOne = require('../model/mongodb').queryOne;
const router = express.Router();

router.post('/', async (req, res) => {
	const emailInput = req.body.email;
	const table = 'user';
	const emailInfo = { email: emailInput };
	const repeatedResult = await queryOne(table, emailInfo);
	console.log(repeatedResult);
	if (repeatedResult == null) {
		const registerInfo = {
			email: emailInput,
			name: req.body.username,
			password: req.body.password,
		};
		const result = await insertOne(table, registerInfo);
		res.send(JSON.stringify(result));
	} else {
		res.status(400);
		res.send(JSON.stringify({ error: 'wrong request' }));
	}
});

module.exports = router;
