//connect to redis
const redis = require('redis');
// const redisClient = redis.createClient({ url: 'redis://redis:6379' });
const redisClient = redis.createClient(6379);

(async () => {
	await redisClient.connect();
})();

exports.redisClient = redisClient;
