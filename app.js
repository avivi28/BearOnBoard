const express = require('express');
const app = express(); //generate express application object

const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: '*',
	},
});

const user = require('./model/user'); //router
const auth = require('./model/auth');
const post = require('./model/post');
const comment = require('./model/comment');
const friend = require('./model/friend');
const { generateUploadURL } = require('./model/s3');
const cookieParser = require('cookie-parser'); //for getting cookies from client

require('dotenv').config();

app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(express.static('public')); //make css & js file accessible

app.set('view engine', 'ejs'); //view engine = template engine, ejs(embedded js)
app.set('views', 'views');

const activeUsers = new Set();
io.on('connection', (socket) => {
	console.log('socket connected');
	socket.on('new user', function (data) {
		socket.userId = data;
		activeUsers.add(data);
		io.emit('new user', [...activeUsers]);
	});

	socket.on('chat message', function (data) {
		io.emit('chat message', data);
	});

	socket.on('disconnect', () => {
		console.log('socket disconnected');
		activeUsers.delete(socket.userId);
		io.emit('user disconnected', socket.userId);
	});
});

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
	res.render('member', { apikey: process.env.GOOGLE_MAP_KEY });
});

app.get('/home', (req, res) => {
	const token = req.cookies.token;
	if (!token) {
		return res.render('index');
	} else {
		res.render('home', { apikey: process.env.GOOGLE_MAP_KEY });
	}
});

app.get('/s3Url', async (req, res) => {
	const url = await generateUploadURL();
	res.send({ url });
}); //get secure url from s3 & return to frontend

app.use('/api/user', user);
app.use('/api/post', post);
app.use('/api/friend', friend);
app.use('/api/comment', comment);
app.use('/auth', auth);

app.use((req, res) => {
	res.status(404);
});

httpServer.listen(9090, function () {
	console.log('website is located in http://localhost:9090/');
});
