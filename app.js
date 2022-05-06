const express = require('express');
const app = express(); //產生express application物件
const user = require('./controller/user');

require('dotenv').config();

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
	let articles = [
		{ title: '123', author: 'bear' },
		{ title: '456', author: 'panda' },
		{ title: '789', author: 'icebear' },
	];
	res.render('index', { trytry: articles });
}); //homepage

app.get('/register', (req, res) => {
	res.render('register');
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
	//port 80 default
	console.log('website is located in http://localhost:9090/');
});
