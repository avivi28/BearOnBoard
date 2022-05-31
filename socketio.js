module.exports = {
	connectSocket: (httpServer) => {
		const { Server } = require('socket.io');
		const { userJoin, getCurrentUser, userLeave } = require('./utils/users');

		const io = new Server(httpServer, {
			cors: {
				origin: '*',
			},
		});

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
					io.to(user.room).emit(
						'leftMessage',
						`${user.userName}has left the chat`
					);
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
	},
};
