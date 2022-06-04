//connect to redis
const redis = require('redis');
const Queue = require('bull');

// const redisClient = redis.createClient({ url: 'redis://redis:6379' });
const redisClient = redis.createClient(6379);
const chatroomQueue = new Queue('chatroom message');

(async () => {
	await redisClient.connect();
})();

exports.redisClient = redisClient;
exports.chatroomQueue = chatroomQueue;
