const express = require('express');
const app = express(); //產生express application物件
const user = require('./model/user'); //router
require('./model/auth');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); //for getting cookies from client

require('dotenv').config();

app.use(passport.initialize());

app.use(cookieParser());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(express.static('public')); //make css & js file accessible

app.set('view engine', 'ejs'); //view engine = template engine, ejs(embedded js)
app.set('views', 'views');

app.use(
	'/',
	(req, res, next) => {
		console.log('Request URL:', req.originalUrl);
		next();
	},
	(req, res, next) => {
		console.log('Request Type:', req.method);
		next();
	}
); //middleware

app.get('/', (req, res) => {
	res.render('index');
}); //homepage

app.get('/register', (req, res) => {
	res.render('register');
});

app.get(
	'/auth/google',
	passport.authenticate('google', {
		session: false,
		scope: ['email', 'profile'],
	})
);

app.get(
	'/auth/google/callback',
	passport.authenticate('google', {
		session: false,
		failureRedirect: '/auth/failure',
	}),
	(req, res) => {
		console.log(req.user);
		const googleEmail = req.user.email;
		jwt.sign({ googleEmail }, process.env.JWT_TOKEN_SECRET, (err, token) => {
			res.cookie('token', token, { httpOnly: true }).redirect('/home');
		});
	}
);

app.get('/auth/failure', (req, res) => {
	res.send('something went wrong...');
});

app.get('/home', (req, res) => {
	const token = req.cookies.token;
	if (!token) {
		return res.sendStatus(403);
	} else {
		res.render('home');
	}
});

app.use('/api/user', user);

app.use((req, res) => {
	res.status(404);
});

app.listen(9090, function () {
	console.log('website is located in http://localhost:9090/');
});
