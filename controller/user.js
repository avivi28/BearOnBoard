const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const insertOne = require('../model/mongodb').insertOne;
const queryOne = require('../model/mongodb').queryOne;

//---------JWT token-------------
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

//---------login API-------------
router.patch('/', async (req, res) => {
	const emailInput = req.body.email;
	const passwordInput = req.body.password;
	const loginInfo = {
		email: emailInput,
	};
	const table = 'user';
	const repeatedResult = await queryOne(table, loginInfo);
	console.log(repeatedResult);
	//--------------Bcrypt Check Pw---------------
	const salt = await bcrypt.genSalt(10);
	const hash = bcrypt.hashSync(passwordInput, salt);
	const bcryptResult = bcrypt.compare(passwordInput, hash);

	if (repeatedResult != null && bcryptResult) {
		jwt.sign({ emailInput }, process.env.JWT_TOKEN_SECRET, (err, token) => {
			res.cookie('token', token, { httpOnly: true }).json({ ok: true });
		});
	} else {
		res.status(400).json({ error: 'wrong request' });
	}
});

//---------register API-------------
router.post('/', async (req, res) => {
	const emailInput = req.body.email;
	const table = 'user';
	const emailInfo = { email: emailInput };
	const repeatedResult = await queryOne(table, emailInfo);
	if (repeatedResult == null) {
		const passwordInput = req.body.password;

		//--------------Bcrypt Hash Pw---------------
		const salt = await bcrypt.genSalt(10); // salt(random string) for hashing pw
		hashedInput = await bcrypt.hash(passwordInput, salt);
		console.log(passwordInput);
		const registerInfo = {
			email: emailInput,
			name: req.body.username,
			password: hashedInput,
		};
		const result = await insertOne(table, registerInfo);
		res.json(result);
	} else {
		res.status(400).json({ error: 'wrong request' });
	}
});

//---------logout API-------------
router.delete('/', async (req, res) => {
	res.clearCookie('token').json({ ok: true });
});

module.exports = router;
