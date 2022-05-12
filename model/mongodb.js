const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

mongoPw = process.env.MONGO_PASSWORD;
mongoDB = process.env.MONGO_DATABASE;

const uri = `mongodb+srv://bear:${mongoPw}@cluster0.8gjko.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	maxPoolSize: 10,
});
async function insertOne(tableName, userInfo) {
	try {
		await client.connect();
		const database = client.db(mongoDB);
		const table = database.collection(tableName);
		await table.insertOne(userInfo);
		return { ok: true };
	} catch (e) {
		console.error(e);
	} finally {
		await client.close();
	}
}

async function queryOne(tableName, queryInfo) {
	try {
		await client.connect();
		const database = client.db(mongoDB);
		const table = database.collection(tableName);
		const result = await table.findOne(queryInfo);
		return result;
	} finally {
		await client.close();
	}
}

async function queryMany(tableName, queryInfo) {
	try {
		await client.connect();
		const database = client.db(mongoDB);
		const table = database.collection(tableName);
		const result = await table.find(queryInfo).toArray();
		return result;
	} finally {
		await client.close();
	}
}

exports.insertOne = insertOne;
exports.queryOne = queryOne;
exports.queryMany = queryMany;
