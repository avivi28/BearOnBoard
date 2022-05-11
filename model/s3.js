const AWS = require('aws-sdk');
require('dotenv').config({ path: '.env' });
const crypto = require('crypto');
const { promisify } = require('util');
let randomBytes = promisify(crypto.randomBytes);

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const secretKEY = process.env.AWS_SECRET_KEY;
const accessKEY = process.env.AWS_ACCESS_KEY;

AWS.config.update({
	maxRetries: 3,
	httpOptions: { timeout: 30000, connectTimeout: 5000 },
	region: bucketRegion,
	accessKeyId: accessKEY,
	secretAccessKey: secretKEY,
});
// for solving Missing credentials errors

const s3 = new AWS.S3({
	bucketRegion,
	accessKEY,
	secretKEY,
	signatureVersion: 'v4',
});

// get the access url from s3 and return to frontend
async function generateUploadURL() {
	const rawBytes = await randomBytes(16);
	const imageName = rawBytes.toString('hex');
	//for security, dun let others get all images from s3

	const params = {
		Bucket: bucketName,
		Key: imageName,
		Expires: 60,
	};

	const uploadURL = await s3.getSignedUrlPromise('putObject', params);
	return uploadURL;
}

exports.generateUploadURL = generateUploadURL;
