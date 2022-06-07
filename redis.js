//connect to redis
const redis = require('redis');
//message queue
const Bull = require('bull');

// const redisClient = redis.createClient({ url: 'redis://redis:6379' });
const redisClient = redis.createClient(6379);
const chatroomQueue = new Bull('chatroom message');

(async () => {
	await redisClient.connect();
})();

exports.redisClient = redisClient;
exports.chatroomQueue = chatroomQueue;
