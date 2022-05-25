const users = [];

//Join user to chat
function userJoin(id, userName, room) {
	const user = { id, userName, room };

	users.push(user);
	const usersLength = users.length - 1;
	return users[usersLength];
}

//Get current user
function getCurrentUser(id) {
	// let results = users.filter((user) => user.includes(`${id}`));
	results = users.filter((user) => user.id == id);
	const resultsLength = results.length - 1;
	return results[resultsLength];
}

//User leaves chat
function userLeave(id) {
	const index = users.findIndex((user) => user.id === id);
	if (index !== -1) {
		//when not equal
		return users.splice(index, 1)[0]; //for remove specific element in array
	}
}

//Get room users
function getRoomUsers(id) {
	// return users.filter((user) => user.room === room);
	return users.filter(filterUser);
}

function filterUser(id) {
	return users.id == id;
}

exports.getCurrentUser = getCurrentUser;
exports.userJoin = userJoin;
exports.userLeave = userLeave;
exports.getRoomUsers = getRoomUsers;
