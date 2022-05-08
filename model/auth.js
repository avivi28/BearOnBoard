const passport = require('passport');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const insertOne = require('./mongodb').insertOne;
const queryOne = require('./mongodb').queryOne;

require('dotenv').config({ path: '.env' });

const table = 'user';
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: 'https://bearonboard.online/auth/google/callback',
			passReqToCallback: true,
		},
		function (request, accessToken, refreshToken, profile, done) {
			return done(null, profile);
		}
	)
);

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

router.get(
	'/google',
	passport.authenticate('google', {
		session: false,
		scope: ['email', 'profile'],
	})
);

router.get(
	'/google/callback',
	passport.authenticate('google', {
		session: false,
		failureRedirect: '/auth/failure',
	}),
	async (req, res) => {
		const googleEmail = req.user.email;
		const emailInfo = { email: googleEmail };
		const repeatedResult = await queryOne(table, emailInfo);
		if (repeatedResult == null) {
			const registerInfo = {
				email: googleEmail,
				name: req.user.displayName,
			};
			await insertOne(table, registerInfo);
		}
		jwt.sign({ googleEmail }, process.env.JWT_TOKEN_SECRET, (err, token) => {
			res.cookie('token', token, { httpOnly: true }).redirect('/home');
		});
	}
);

router.get('/failure', (req, res) => {
	res.send('something went wrong...');
});

module.exports = router;
