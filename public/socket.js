//----------get User info from JWT------------
let JWTcookies = document.cookie;
const base64Url = JWTcookies.split('.')[1];
const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
const jsonPayload = decodeURIComponent(
	atob(base64)
		.split('')
		.map(function (c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		})
		.join('')
);
const userData = JSON.parse(jsonPayload);
const userId = userData['userId'];

//------------socket.io-------------
const socket = io('http://localhost:9090');
console.log(socket);
let userName = '';

const newUserConnected = () => {
	userName = userData['userName'];
	socket.emit('new user', userName);
	showStatus(userName);
};

function showStatus(userName) {
	if (!document.getElementById(`friendName${userName}`)) {
		return;
	}

	document.getElementById(`friendName${userName}`).style.background =
		'rgb(85 228 82)';
}
function showOffline(userName) {
	document.getElementById(`friendName${userName}`).style.background =
		'rgb(220 213 231)';
}

// new user is created so we generate nickname and emit event
newUserConnected();

socket.on('new user', function (data) {
	data.map((userName) => showStatus(userName));
});

socket.on('user disconnected', function (userName) {
	showOffline(userName);
});
