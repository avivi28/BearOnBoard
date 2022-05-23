const passport = require('passport');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('./dbSchema/userSchema.js');

require('dotenv').config({ path: '.env' });

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
		const repeatedResult = await User.findOne({ email: googleEmail });
		if (repeatedResult == null) {
			const user = new User({
				email: googleEmail,
				name: req.user.displayName,
			});
			await user.save();
			const newUserResult = await User.findOne({ email: googleEmail });
			jwt.sign(
				{
					userId: newUserResult['_id'],
					emailInput: googleEmail,
					userName: newUserResult['name'],
				},
				process.env.JWT_TOKEN_SECRET,
				(err, token) => {
					res.cookie('token', token).redirect('/home');
				}
			);
		} else {
			jwt.sign(
				{
					userId: repeatedResult['_id'],
					emailInput: googleEmail,
					userName: repeatedResult['name'],
				},
				process.env.JWT_TOKEN_SECRET,
				(err, token) => {
					res.cookie('token', token).redirect('/home');
				}
			);
		}
	}
);

router.get('/failure', (req, res) => {
	res.send('something went wrong...');
});

module.exports = router;
