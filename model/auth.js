const passport = require('passport');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('./dbSchema/userSchema.js');
const Friend = require('./dbSchema/friendSchema.js');
const { ObjectId } = require('mongodb');

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
		try {
			const googleEmail = req.user.email;
			const repeatedResult = await User.findOne({ email: googleEmail });
			if (repeatedResult == null) {
				const user = new User({
					email: googleEmail,
					name: req.user.displayName,
				});
				await user.save();
				const newUserResult = await User.findOne({ email: googleEmail });

				//------adding default friend for user to test-----
				const friendInfo = {
					sender: '628b2e8340cb83fbf83b7c2d',
					recipient: ObjectId(newUserResult['_id']),
				};
				const userInfo = {
					sender: ObjectId(newUserResult['_id']),
					recipient: '628b2e8340cb83fbf83b7c2d',
				};
				const statusUpdate = {
					status: 1, //1:accept 0:panding
				};
				await Friend.findOneAndUpdate(userInfo, statusUpdate, {
					new: true,
				});
				await Friend.findOneAndUpdate(friendInfo, statusUpdate, {
					new: true,
				}); //(filter,update)
				await User.findOneAndUpdate(
					{
						_id: ObjectId(newUserResult['_id']),
					},
					{ $push: { friends: '628b2e8340cb83fbf83b7c2d' } }
				); //add friend's id into User schema
				await User.findOneAndUpdate(
					{
						_id: '628b2e8340cb83fbf83b7c2d',
					},
					{ $push: { friends: ObjectId(newUserResult['_id']) } }
				);

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
		} catch (e) {
			res.status(500).json({ error: true, message: 'server error' });
		}
	}
);

router.get('/failure', (req, res) => {
	res.send('something went wrong...');
});

module.exports = router;
