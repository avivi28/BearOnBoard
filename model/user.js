const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('./dbSchema/userSchema.js');

//---------JWT token-------------
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

//-------Get user id API-------
router.get('/', async (req, res) => {
	try {
		const username = req.query.username;
		const result = await User.findOne({ name: username }).select({ name: 1 }); //return certain fields
		res.json(result);
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
});

//-------Get friend's info API-------
router.get('/:userId', async (req, res) => {
	try {
		const userId = ObjectId(req.params.userId);
		const result = await User.findOne({ _id: userId }).populate({
			path: 'friends',
			select: 'name',
		});
		res.json(result);
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
});

//---------login API-------------
router.patch('/', async (req, res) => {
	try {
		const emailInput = req.body.email;
		const passwordInput = req.body.password;
		const loginInfo = {
			email: emailInput,
		};
		const repeatedResult = await User.findOne(loginInfo);
		//--------------Bcrypt Check Pw---------------
		const truePw = repeatedResult['password'];
		const bcryptResult = bcrypt.compareSync(passwordInput, truePw);

		if (repeatedResult != null && bcryptResult) {
			const userId = repeatedResult['_id'];
			const userName = repeatedResult['name'];
			jwt.sign(
				{ userId, emailInput, userName },
				process.env.JWT_TOKEN_SECRET,
				(err, token) => {
					res.cookie('token', token).json({ ok: true });
				}
			);
		} else {
			res.status(400).json({ error: 'wrong request' });
		}
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
});

//---------register API-------------
router.post('/', async (req, res) => {
	try {
		const emailInput = req.body.email;
		const emailInfo = { email: emailInput };
		const repeatedResult = await User.findOne(emailInfo);
		if (repeatedResult == null) {
			const passwordInput = req.body.password;

			//--------------Bcrypt Hash Pw---------------
			const salt = await bcrypt.genSalt(10); // salt(random string) for hashing pw
			hashedInput = await bcrypt.hash(passwordInput, salt);
			const registerInfo = {
				email: emailInput,
				name: req.body.username,
				password: hashedInput,
			};
			const user = new User(registerInfo);
			const registedResult = await user.save();
			res.json({ ok: true, id: registedResult['_id'] });
		} else {
			res.status(400).json({ error: 'wrong request' });
		}
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
});

//---------logout API-------------
router.delete('/', async (req, res) => {
	try {
		res.clearCookie('token').json({ ok: true });
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
});

module.exports = router;
