const express = require('express');
const router = express.Router();

const User = require('./dbSchema/userSchema.js');

//---------search engine of friend's name API-------------
router.patch('/', async (req, res) => {
	const payload = req.body.payload.trim(); //trim():remove all whitespace
	let search = await User.find({
		name: { $regex: new RegExp('^' + payload + '.*', 'i') },
	})
		.select({
			name: 1,
			_id: 0,
		}) //return name field only
		.exec();
	//Limit search results to 10
	search = search.slice(0, 10);
	res.send({ payload: search });
});

module.exports = router;
