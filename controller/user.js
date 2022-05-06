const express = require('express');
const router = express.Router();

const insertOne = require('../model/mongodb').insertOne;
const queryOne = require('../model/mongodb').queryOne;

//---------JWT token-------------
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

//------verify user status API-------
router.get('/', async (req, res) => {
	const token = req.cookies.token;
	if (!token) {
		return res.sendStatus(403);
	}
	try {
		const data = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
	} catch {
		return res.sendStatus(403);
	}
});

//---------login API-------------
router.patch('/', async (req, res) => {
	const emailInput = req.body.email;
	const loginInfo = {
		email: emailInput,
		password: req.body.password,
	};
	const table = 'user';
	const repeatedResult = await queryOne(table, loginInfo);
	if (repeatedResult != null) {
		jwt.sign({ emailInput }, process.env.JWT_TOKEN_SECRET, (err, token) => {
			res.cookie('token', token, { httpOnly: true }).json({ ok: true });
		});
	} else {
		res.status(400);
		res.send(JSON.stringify({ error: 'wrong request' }));
	}
});

//---------register API-------------
router.post('/', async (req, res) => {
	const emailInput = req.body.email;
	const table = 'user';
	const emailInfo = { email: emailInput };
	const repeatedResult = await queryOne(table, emailInfo);
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

//---------logout API-------------
router.delete('/', async (req, res) => {
	res.clearCookie('token').json({ ok: true });
});

module.exports = router;
