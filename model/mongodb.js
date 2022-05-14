const mongoose = require('mongoose');
require('dotenv').config();

mongoPw = process.env.MONGO_PASSWORD;
const uri = `mongodb+srv://bear:${mongoPw}@cluster0.8gjko.mongodb.net/bearonboard?retryWrites=true&w=majority`;
mongoose.connect(uri);

const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => {
	console.log('Connected to Mongoose');
});
