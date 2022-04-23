const express = require('express');
const app = express(); //產生express application物件
const mysql = require('mysql');
require('dotenv').config();

var con = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
});

con.connect(function (err) {
	if (err) throw err;
	console.log('Connected!');
});

app.use(express.static('public')); //make css & js file accessible
app.use(express.urlencoded({ extended: true })); //for getting the data sent from client

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

app.post('/', (req, res) => {
	console.log(req.body.username);
});

app.use((req, res) => {
	res.status(404);
});

app.listen(3000, function () {
	//port 3000
	console.log('website is located in http://localhost:3000/');
});