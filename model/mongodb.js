const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' });

mongoPw = process.env.MONGO_PASSWORD;
mongoDB = process.env.MONGO_DATABASE;
mongohost = process.env.MONGO_HOSTNAME;

const uri = `mongodb+srv://bear:${mongoPw}@${mongohost}/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	maxPoolSize: 10,
	writeConcern: majority,
});
async function insertOne(tableName, userInfo) {
	try {
		await client.connect();
		const database = client.db(mongoDB);
		const table = database.collection(tableName);
		const result = await table.insertOne(userInfo);
		return result;
	} finally {
		await client.close();
	}
}

async function queryOne(tableName, queryInfo) {
	try {
		await client.connect();
		const database = client.db(mongoDB);
		const table = database.collection(tableName);
		const result = await table.find(queryInfo);
		return result;
	} finally {
		await client.close();
	}
}

exports.insertOne = 'insertOne';
exports.queryOne = 'queryOne';
