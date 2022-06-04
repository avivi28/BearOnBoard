module.exports = {
	connectDb: () => {
		const mongoose = require('mongoose');
		require('dotenv').config();
		mongoose.connect(process.env.MONGO_ACCESS, {
			maxPoolSize: 10, // Maintain up to 10 socket connections
			socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
		});
		const db = mongoose.connection;
		db.on('error', (error) => {
			console.log('Mongo connection has an error', error);
			mongoose.disconnect();
		});
		db.once('open', () => {
			console.log('Connected to MongoDB');
		});
	},
};
