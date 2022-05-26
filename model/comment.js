const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

const Comment = require('./dbSchema/commentSchema.js');

//------------get friends' comments API--------------
router.get('/:postId', async (req, res) => {
	try {
		const commentResult = await Comment.find({
			postId: ObjectId(req.params.postId),
		}).populate({
			path: 'commenter',
			select: 'name',
		});
		res.json(commentResult);
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
});

//------------get friends' comments API--------------
router.patch('/', async (req, res) => {
	try {
		const comment = new Comment({
			commenter: ObjectId(req.body.userId),
			postId: ObjectId(req.body.postId),
			comment: req.body.comment,
		});
		await comment.save();
		res.json({ ok: true });
	} catch (e) {
		res.status(500).json({ error: true, message: 'server error' });
	}
});

module.exports = router;
