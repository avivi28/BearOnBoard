const express = require('express');
const app = express(); //generate express application object

const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_ACCESS);
const db = mongoose.connection;
db.on('error', (error) => {
	console.log('Mongo connection has an error', error);
	mongoose.disconnect();
});
db.once('open', () => {
	console.log('Connected to Mongoose');
});

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
const chatroom = require('./model/chatroom');
const { generateUploadURL } = require('./model/s3');
const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
} = require('./utils/users');
const cookieParser = require('cookie-parser'); //for getting cookies from client

app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(express.static('public')); //make css & js file accessible

app.set('view engine', 'ejs'); //view engine = template engine, ejs(embedded js)
app.set('views', 'views');

const activeUsers = new Set();
io.on('connection', (socket) => {
	//connect to socket io server
	console.log('socket connected');
	socket.on('newUser', function (data) {
		//listen event
		socket.userId = data;
		activeUsers.add(data);
		io.emit('newUser', [...activeUsers]); //send to all clients
	});

	socket.on('joinRoom', ({ userName, room }) => {
		const user = userJoin(socket.id, userName, room);

		socket.join(user.room);
	});

	socket.on('disconnect', () => {
		activeUsers.delete(socket.userId);
		io.emit('user disconnected', socket.userId);

		const user = userLeave(socket.id);
		console.log('socket disconnected');
		if (user) {
			io.to(user.room).emit('leftMessage', `${user.userName}has left the chat`);
		}
	});

	socket.on('chatMessage', (msg, room) => {
		const user = getCurrentUser(socket.id);

		io.to(user.room).emit('message', msg, user.room);
	});

	socket.on('typing', function (data, room) {
		const user = getCurrentUser(socket.id);
		io.to(user.room).emit('typing', data);
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
	// res.render('index');
	const token = req.cookies.token;
	if (!token) {
		return res.render('index');
	} else {
		res.render('home', { apikey: process.env.GOOGLE_MAP_KEY });
	}
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
app.use('/api/chatroom', chatroom);
app.use('/auth', auth);

app.use((req, res) => {
	res.status(404);
});

httpServer.listen(9090, function () {
	console.log('website is located in http://localhost:9090/');
});
