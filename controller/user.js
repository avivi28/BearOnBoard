const express = require('express');
const insertOne = require('../model/mongodb').insertOne;
const router = express.Router();

router.post('/', async (req, res) => {
	const emailInput = req.body.email;
	const nameInput = req.body.username;
	const passwordInput = req.body.password;
	const table = 'user';
	const registerInfo = {
		email: emailInput,
		name: nameInput,
		password: passwordInput,
	};
	const result = await insertOne(table, registerInfo);
	res.send(JSON.stringify(result));
});

module.exports = router;
