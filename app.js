const express = require('express');
const app = express(); //產生express application物件
const user = require('./model/user'); //router
const auth = require('./model/auth');
const cookieParser = require('cookie-parser'); //for getting cookies from client
const cors = require('cors');

require('dotenv').config();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded()); // Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.json()); // Parse JSON bodies (as sent by API clients)
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

app.get('/member', (req, res) => {
	res.render('member');
});

app.get('/home', (req, res) => {
	const token = req.cookies.token;
	if (!token) {
		return res.render('index');
	} else {
		res.render('home');
	}
});

app.use('/api/user', user);
app.use('/auth', auth);

app.use((req, res) => {
	res.status(404);
});

app.listen(9090, function () {
	console.log('website is located in http://localhost:9090/');
});
