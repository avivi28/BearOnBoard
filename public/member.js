const socket = io();

//-----------logOut Function----------------
function logout() {
	fetch('/api/user', {
		method: 'DELETE',
	})
		.then((Res) => Res.json())
		.then((Res) => {
			const okData = Res['ok'];
			if (okData == true) {
				location.href = '/';
			}
		})
		.catch((error) => console.log(error));
}

//----------------Posts Modal---------------
const modal = document.getElementById('modal');
function addFriend() {
	modal.style.display = 'block';
}
function hideFriend() {
	modal.style.display = 'none';
}

const addFriendButton = document.getElementById('friends_add');
function showAddFriend() {
	addFriendButton.src =
		'https://d3qxlv297wj1rn.cloudfront.net/images/add_friends_hover.svg';
}
function hideAddFriend() {
	addFriendButton.src =
		'https://d3qxlv297wj1rn.cloudfront.net/images/add_friends.svg';
}

const backLocation = document.getElementById('back_location');
function showReturn() {
	backLocation.src =
		'https://d3qxlv297wj1rn.cloudfront.net/images/back_to_location_hover.svg';
}
function hideReturn() {
	backLocation.src =
		'https://d3qxlv297wj1rn.cloudfront.net/images/back_to_location.svg';
}
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

//------------Show current user Info-------------
const editName = document.getElementById('edit_name');
const editEmail = document.getElementById('edit_email');
editName.textContent = userData['userName'];
if (userData['emailInput'].length > 15) {
	editEmail.textContent = userData['emailInput'].slice(0, 15) + '...';
} else {
	editEmail.textContent = userData['emailInput'];
}

//------------Friends Search Engine-------------
const submitButton = document.getElementById('submit_newfriends');
function disableSubmit() {
	submitButton.disabled = true;
	submitButton.style.cursor = 'not-allowed';
}

const friendsForm = document.getElementById('friendform');
const noResult = document.createElement('p');
disableSubmit();

function sendData(e) {
	const searchResults = document.getElementById('search_results');
	fetch('/api/friend', {
		method: 'PATCH',
		headers: new Headers({
			'Content-Type': 'application/json;charset=utf-8',
		}),
		body: JSON.stringify({ payload: e.value }),
	})
		.then((res) => res.json())
		.then((res) => {
			const payload = res.payload;
			searchResults.innerHTML = '';
			if (payload.length < 1) {
				noResult.innerHTML = 'Sorry. Nothing Found 😭';
				disableSubmit();
				noResult.className = 'no_found';
				noResult.style.display = 'block';
				friendsForm.appendChild(noResult);
				return;
			} else {
				payload.forEach((item, index) => {
					noResult.style.display = 'none';
					submitButton.disabled = false;
					submitButton.style.cursor = 'pointer';
					searchResults.innerHTML += `<option>${item.name}</option>`;
					return;
				});
			}
		});
	return;
}

//-----------Confirm Send Friends Request------------
const confirmModal = document.getElementById('confirm_modal');
const confirmText = document.getElementById('confirm-text');
const confirmIcon = document.getElementById('icon-confirm');

function hideConfirm() {
	confirmModal.style.display = 'none';
}
function showNormal() {
	confirmIcon.src =
		'https://d3qxlv297wj1rn.cloudfront.net/images/normal-bear.png';
}
function showHappy() {
	confirmIcon.src =
		'https://d3qxlv297wj1rn.cloudfront.net/images/happy-bear.png';
}
function showShock() {
	confirmIcon.src =
		'https://d3qxlv297wj1rn.cloudfront.net/images/cancel-bear.png';
}

friendsForm.addEventListener('submit', function confirm(ev) {
	ev.preventDefault();
	yesButton.disabled = false;
	confirmModal.style.display = 'block';
	buttonContainer.style.display = 'inherit';
	confirmIcon.style.display = 'inherit';
	newIcon.style.display = 'none';
	reasonText.style.display = 'none';
	reasonText.style.display = 'none';
	newIcon.style.display = 'none';

	let formData = new FormData(friendsForm);
	const NameInput = new URLSearchParams(formData);
	const jsonData = Object.fromEntries(NameInput.entries());
	const friendsName = jsonData['username'];

	confirmText.textContent = `Add "${friendsName}" ?`;

	sendRequest(friendsName);
});

//------------Friends Request System------------
const yesButton = document.getElementById('yes-button');

function sendRequest(friendsName) {
	yesButton.addEventListener('click', function getId(ev) {
		ev.preventDefault();
		yesButton.disabled = true;

		fetch(`/api/user?username=${friendsName}`, {
			method: 'GET',
		})
			.then((Res) => Res.json())
			.then((Res) => {
				postFriend(Res);
			})
			.catch((error) => console.log(error));
	});
}

const buttonContainer = document.getElementById('button-container');
const requestContainer = document.getElementById('request-container');
const bearContainer = document.getElementById('bear-container');
const newIcon = document.createElement('img');
const reasonText = document.createElement('p');

function postFriend(Res) {
	const bodyData = {
		userId: userId,
		friendId: Res['_id'],
	};

	if (userId == Res['_id']) {
		//cannot send to youeself
		showFailResult();
	} else {
		fetch('/api/friend', {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json;charset=utf-8',
			}),
			body: JSON.stringify(bodyData),
		})
			.then((Res) => Res.json())
			.then((Res) => {
				const errorData = Res['error'];
				if (errorData == true) {
					showFailResult();
				} else {
					confirmIcon.style.display = 'none';
					reasonText.style.display = 'none';
					newIcon.src =
						'https://d3qxlv297wj1rn.cloudfront.net/images/request-bear.png';
					newIcon.style.display = 'block';
					bearContainer.appendChild(newIcon);
					buttonContainer.style.display = 'none';
					confirmText.style.display = 'block';
					confirmText.textContent = 'Request has been sent!';
				}
			})
			.catch((error) => console.log(error));
	}
}

function showFailResult() {
	confirmIcon.style.display = 'none';
	newIcon.src = 'https://d3qxlv297wj1rn.cloudfront.net/images/sad-bear.png';
	newIcon.style.display = 'block';
	bearContainer.appendChild(newIcon);
	buttonContainer.style.display = 'none';
	confirmText.style.display = 'block';
	confirmText.textContent = `Sorry, you can't send this request!`;
	reasonText.style.display = 'block';
	reasonText.style =
		'font-size: 12px;font-weight: 500;padding: 0px 25px;display:block;';
	reasonText.textContent =
		'Perhaps he/she has been your friend or the request you sent before is still pending!';
	requestContainer.appendChild(reasonText);
}

//------------Get Pending List------------
const pendingList = document.getElementById('pending_list');
function getPending() {
	fetch(`/api/friend?userId=${userId}&status=0`, {
		method: 'GET',
	})
		.then((Res) => Res.json())
		.then((Res) => {
			showPending(Res);
		})
		.catch((error) => console.log(error));
}

function showPending(Res) {
	for (let i = 0; i < Res.length; i++) {
		const yesConfirmButton = document.createElement('button');
		const noConfirmButton = document.createElement('button');
		const pendingContainer = document.createElement('p');
		pendingContainer.className = 'pending_container';
		const friendImage = document.createElement('img');
		friendImage.src =
			'https://d3qxlv297wj1rn.cloudfront.net/images/friends-icon.png';

		const pendingContentContainer = document.createElement('p');
		pendingContentContainer.className = 'pending-content-container';

		const friendName = document.createElement('span');
		friendName.className = 'pending-content';
		const pendingMessage = document.createElement('span');
		pendingMessage.className = 'pending-content';

		yesConfirmButton.className = 'yes-confirm-button';
		noConfirmButton.className = 'no-confirm-button';
		const buttonContainer = document.createElement('span');
		buttonContainer.className = 'yes-no-container';
		const friendId = Res[i]['sender']['_id'];
		const friendData = Res[i]['sender']['name'];
		friendName.textContent = `Name: ${friendData}`;
		pendingMessage.textContent = 'Incoming Friend Request';

		pendingList.appendChild(pendingContainer);
		pendingContainer.appendChild(friendImage);
		pendingContainer.appendChild(pendingContentContainer);
		pendingContentContainer.appendChild(friendName);
		pendingContentContainer.appendChild(pendingMessage);
		pendingContainer.appendChild(buttonContainer);
		buttonContainer.appendChild(yesConfirmButton);
		buttonContainer.appendChild(noConfirmButton);
		// decideRequest(friendId);

		//------Accept or Reject the friend request------
		yesConfirmButton.addEventListener('click', function acceptRequest(ev) {
			ev.preventDefault();

			const bodyData = {
				userId: friendId, // request sender
				friendId: userId, // request receiver
				status: 1,
			};

			fetch('/api/friend', {
				method: 'PUT',
				headers: new Headers({
					'Content-Type': 'application/json;charset=utf-8',
				}),
				body: JSON.stringify(bodyData),
			})
				.then((Res) => Res.json())
				.then((Res) => {
					const okData = Res['ok'];
					if (okData == true) {
						friendContainer.textContent = '';
						pendingContainer.style.display = 'none';
						getFriendLists();
					}
				})
				.catch((error) => console.log(error));
		});

		noConfirmButton.addEventListener('click', function rejectRequest(ev) {
			ev.preventDefault();
			const bodyData = {
				userId: friendId, // request sender
				friendId: userId, // request receiver
			};

			fetch('/api/friend', {
				method: 'DELETE',
				headers: new Headers({
					'Content-Type': 'application/json;charset=utf-8',
				}),
				body: JSON.stringify(bodyData),
			})
				.then((Res) => Res.json())
				.then((Res) => {
					const okData = Res['ok'];
					if (okData == true) {
						pendingContainer.style.display = 'none';
					}
				})
				.catch((error) => console.log(error));
		});
	}
}

getPending();

//------------Show Friends lists----------
function getFriendLists() {
	fetch(`/api/user/${userId}`, {
		method: 'GET',
	})
		.then((Res) => Res.json())
		.then((Res) => {
			showFriendLists(Res);
		})
		.catch((error) => console.log(error));
}
getFriendLists();

const friendContainer = document.getElementById('friendslist_container');
const inputField = document.getElementById('message_input');
const messageForm = document.getElementById('chatroom_form');
const chatroomUser = document.getElementById('chatroom__name');
const chatroomIconContainer = document.getElementById(
	'chatroom_icon__container'
);
const chatroomContainer = document.getElementById('chatroom_container');
const messageBoxContainer = document.getElementById('message_body_container');
const friendNameContainerInChat = document.querySelector(
	'.name-and-status__container'
);

function showFriendLists(Res) {
	for (let j = 0; j < Res['friends'].length; j++) {
		const detailContainer = document.createElement('div');
		detailContainer.className = 'detail-container';
		const nameContainer = document.createElement('p');
		nameContainer.className = 'name-container';
		const clickContainer = document.createElement('p');
		clickContainer.className = 'click-container';

		const imageContainer = document.createElement('div');
		imageContainer.style = 'position: relative;';

		const friendImage = document.createElement('img');
		friendImage.src =
			'https://d3qxlv297wj1rn.cloudfront.net/images/friends-icon.png';
		friendImage.setAttribute('id', 'friends_icon');
		//---------check friends online or offline
		const statusDot = document.createElement('p');
		statusDot.className = 'online-status';
		const friendStatusName = Res['friends'][j]['name'];
		statusDot.setAttribute('id', `friendName${friendStatusName}`);

		showFriendsStatus();

		//------------show chatroom--------------
		const userName = userData['userName'];

		friendImage.addEventListener('click', () => {
			count = 0; //refresh page counting
			nextPage = 1; //refresh scoll event

			document.getElementById('bear_loader').style.display = 'block';
			document.getElementById('loading').style.display = 'block';

			googleMap.style.display = 'none';
			const chatroomStatusDot = document.createElement('p');
			chatroomStatusDot.className = 'chatroom-online-status';
			chatroomStatusDot.setAttribute(
				'id',
				`friendChatroomName${Res['friends'][j]['name']}`
			);
			chatroomIconContainer.appendChild(chatroomStatusDot);

			showChatroomFriendsStatus();

			let room = '';
			messageBoxContainer.textContent = '';
			const messageBox = document.createElement('div');
			messageBoxContainer.appendChild(messageBox);
			chatroomUser.textContent = friendStatusName;
			const friendId = Res['friends'][j]['_id'];
			fetch(
				`/api/chatroom?sender=${userData['userId']}&recipient=${friendId}`,
				{
					method: 'GET',
				}
			)
				.then((Res) => Res.json())
				.then((Res) => {
					const roomId = Res['roomId'];
					creatRoom(Res);
					friendNameContainerInChat.setAttribute('id', `${Res['recipient']}`);
					showHistory(roomId);
					loadMore(roomId);
				})
				.catch((error) => console.log(error));

			function creatRoom(Res) {
				room = Res['roomId'];
				//Join chatrrom
				socket.emit('joinRoom', { userName, room });

				chatroomContainer.style.display = 'block';
				messageBox.textContent = '';
				messageBox.className = 'message_body';
				messageBox.setAttribute('id', `roomId:${room}`);
			}
		});

		nameContainer.addEventListener('click', () => {
			count = 0; //refresh page counting
			nextPage = 1; //refresh scoll event

			document.getElementById('bear_loader').style.display = 'block';
			document.getElementById('loading').style.display = 'block';

			googleMap.style.display = 'none';
			const chatroomStatusDot = document.createElement('p');
			chatroomStatusDot.className = 'chatroom-online-status';
			chatroomStatusDot.setAttribute(
				'id',
				`friendChatroomName${Res['friends'][j]['name']}`
			);
			chatroomIconContainer.appendChild(chatroomStatusDot);

			showChatroomFriendsStatus();

			let room = '';
			messageBoxContainer.textContent = '';
			const messageBox = document.createElement('div');
			messageBoxContainer.appendChild(messageBox);
			chatroomUser.textContent = friendStatusName;
			const friendId = Res['friends'][j]['_id'];
			fetch(
				`/api/chatroom?sender=${userData['userId']}&recipient=${friendId}`,
				{
					method: 'GET',
				}
			)
				.then((Res) => Res.json())
				.then((Res) => {
					const roomId = Res['roomId'];
					creatRoom(Res);
					friendNameContainerInChat.setAttribute('id', `${Res['recipient']}`);
					showHistory(roomId);
					loadMore(roomId);
				})
				.catch((error) => console.log(error));

			function creatRoom(Res) {
				room = Res['roomId'];
				//Join chatrrom
				socket.emit('joinRoom', { userName, room });

				chatroomContainer.style.display = 'block';
				messageBox.textContent = '';
				messageBox.className = 'message_body';
				messageBox.setAttribute('id', `roomId:${room}`);
			}
		});

		const friendName = document.createElement('p');
		friendName.className = 'friends_name';
		const friendBio = document.createElement('p');
		friendBio.className = 'friends_bio';

		const friendGps = document.createElement('img');
		friendGps.src =
			'https://d3qxlv297wj1rn.cloudfront.net/images/friends_gps.svg';
		friendGps.setAttribute('id', 'friends_jps');
		friendGps.setAttribute('alt', 'locate');
		const deleteFriend = document.createElement('img');
		deleteFriend.src =
			'https://d3qxlv297wj1rn.cloudfront.net/images/delete_friends.svg';
		deleteFriend.setAttribute('id', 'friends_delete');
		deleteFriend.setAttribute('alt', 'delete');

		const realName = Res['friends'][j]['name'];
		const realId = Res['friends'][j]['_id'];

		friendName.textContent = `Name: ${realName}`;
		friendBio.textContent = `Let's be fluffy!`;

		friendContainer.appendChild(detailContainer);
		detailContainer.appendChild(imageContainer);
		imageContainer.appendChild(friendImage);
		imageContainer.appendChild(statusDot);
		detailContainer.appendChild(nameContainer);
		detailContainer.appendChild(clickContainer);
		nameContainer.appendChild(friendName);
		nameContainer.appendChild(friendBio);
		clickContainer.appendChild(friendGps);
		clickContainer.appendChild(deleteFriend);

		decideFriendAction(realId, realName, friendGps, deleteFriend);
	}
}

//---------check friends online or offline
function showFriendsStatus() {
	let userName = '';

	const newUserConnected = () => {
		userName = userData['userName'];
		socket.emit('newUser', userName); //append new username into list on server
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
		if (document.getElementById(`friendName${userName}`)) {
			document.getElementById(`friendName${userName}`).style.background =
				'rgb(220 213 231)';
		}
	}

	// new user is created so we generate nickname and emit event
	newUserConnected();

	socket.on('newUser', function (data) {
		data.map((userName) => showStatus(userName));
	});

	socket.on('user disconnected', function (userName) {
		showOffline(userName);
	});
}

//---------check friends online or offline (for chatroom icon)
const chatroomStatus = document.getElementById('chatroom__status');
function showChatroomFriendsStatus() {
	let userName = '';

	const newUserConnected = () => {
		userName = userData['userName'];
		socket.emit('newUser', userName); //append new username into list on server
		showStatus(userName);
	};

	function showStatus(userName) {
		if (!document.getElementById(`friendChatroomName${userName}`)) {
			return;
		}
		document.getElementById(`friendChatroomName${userName}`).style.background =
			'rgb(85 228 82)';
		chatroomStatus.textContent = 'online';
	}
	function showOffline(userName) {
		document.getElementById(`friendChatroomName${userName}`).style.background =
			'rgb(220 213 231)';
		chatroomStatus.textContent = 'offline';
	}

	// new user is created so we generate nickname and emit event
	newUserConnected();

	socket.on('newUser', function (data) {
		data.map((userName) => showStatus(userName));
	});

	socket.on('user disconnected', function (userName) {
		showOffline(userName);
	});
}

//------------show chatroom--------------
const addNewMessage = ({ userName, message }, room) => {
	const time = new Date();
	const formattedTime = time.toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
	});

	const receivedMsg = `
	<div class="incoming__message">
		<div class="received__message">
		<p>${message}</p>
		<div class="message__info">
			<span class="message__author">${userName}</span>
			<span class="time_date">${formattedTime}</span>
		</div>
		</div>
	</div>`;

	const myMsg = `
	<div class="outgoing__message">
		<div class="sent__message">
		<p>${message}</p>
		<div class="message__info">
			<span class="time_date">${formattedTime}</span>
		</div>
		</div>
	</div>`;

	document.getElementById(`roomId:${room}`).innerHTML +=
		userName === userData['userName'] ? myMsg : receivedMsg;

	// Scroll down
	document.getElementById(`roomId:${room}`).scrollTop = document.getElementById(
		`roomId:${room}`
	).scrollHeight;
};

//---------------send messages----------------
messageForm.addEventListener('click', (e) => {
	e.preventDefault();
	const roomNumber = document.querySelector('.message_body');

	if (!inputField.value) {
		return;
	}
	//-------input into database as chat history--------
	const time = new Date();
	const formattedTime = time.toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
	});

	let formData = new FormData(messageForm);
	const messageInput = new URLSearchParams(formData);
	const jsonData = Object.fromEntries(messageInput.entries());
	let bodyData = {
		message: jsonData['message'],
		roomId: roomNumber.id.split(':')[1],
		time: formattedTime,
		sender: userId,
		recipient: friendNameContainerInChat.id,
	};

	fetch('/api/chatroom', {
		method: 'POST',
		headers: new Headers({
			'Content-Type': 'application/json;charset=utf-8',
		}),
		body: JSON.stringify(bodyData),
	})
		.then((Res) => Res.json())
		.catch((error) => console.log(error));
	socket.emit('chatMessage', {
		message: inputField.value,
		name: userName,
	});
	inputField.value = '';
});

//Get message from server
socket.on('message', (data, room) => {
	//catch return from server
	addNewMessage(
		{
			userName: data.name,
			message: data.message,
		},
		room
	);
});

//------------Show history chat message---------------
let count = 0;
let nextPage = 1;
function showHistory(roomId) {
	const newContainer = document.createElement('div');
	newContainer.setAttribute('id', `new_container:${roomId}`);

	let bodyData = {
		count: count,
		roomId: roomId,
	};

	fetch(`/api/chatroom/`, {
		method: 'PUT',
		headers: new Headers({
			'Content-Type': 'application/json;charset=utf-8',
		}),
		body: JSON.stringify(bodyData),
	})
		.then((Res) => Res.json())
		.then((Res) => {
			document.getElementById('bear_loader').style.display = 'none';
			document.getElementById('loading').style.display = 'none';
			for (let i = Res.length - 1; i >= 0; i--) {
				const receivedMsg = `
				<div class="incoming__message">
					<div class="received__message">
					<p>${Res[i]['message']}</p>
					<div class="message__info">
						<span class="message__author">${Res[i]['sender']['name']}</span>
						<span class="time_date">${Res[i]['time']}</span>
					</div>
					</div>
				</div>`;

				const myMsg = `
				<div class="outgoing__message">
					<div class="sent__message">
					<p>${Res[i]['message']}</p>
					<div class="message__info">
						<span class="time_date">${Res[i]['time']}</span>
					</div>
					</div>
				</div>`;

				document.getElementById(`roomId:${roomId}`).innerHTML +=
					Res[i]['sender']['name'] === userData['userName']
						? myMsg
						: receivedMsg;

				// Scroll down first
				document.getElementById(`roomId:${roomId}`).scrollTop =
					document.getElementById(`roomId:${roomId}`).scrollHeight;
			}

			document
				.getElementById(`roomId:${roomId}`)
				.insertBefore(
					newContainer,
					document.getElementById(`roomId:${roomId}`).firstChild
				);
		})
		.catch((error) => console.log(error));
}

function showHistoryMore(roomId, count) {
	const newHistoryContainer = document.createElement('div');
	newHistoryContainer.setAttribute(
		'id',
		`new_container:${roomId}&count:${count}`
	);

	document
		.getElementById(`roomId:${roomId}`)
		.insertBefore(
			newHistoryContainer,
			document.getElementById(`roomId:${roomId}`).firstChild
		);

	let bodyData = {
		count: count,
		roomId: roomId,
	};

	fetch(`/api/chatroom/`, {
		method: 'PUT',
		headers: new Headers({
			'Content-Type': 'application/json;charset=utf-8',
		}),
		body: JSON.stringify(bodyData),
	})
		.then((Res) => Res.json())
		.then((Res) => {
			if (Res.length <= 5) {
				nextPage = 0;
			}
			for (let i = Res.length - 1; i >= 0; i--) {
				const receivedMsg = `
				<div class="incoming__message">
					<div class="received__message">
					<p>${Res[i]['message']}</p>
					<div class="message__info">
						<span class="message__author">${Res[i]['sender']['name']}</span>
						<span class="time_date">${Res[i]['time']}</span>
					</div>
					</div>
				</div>`;

				const myMsg = `
				<div class="outgoing__message">
					<div class="sent__message">
					<p>${Res[i]['message']}</p>
					<div class="message__info">
						<span class="time_date">${Res[i]['time']}</span>
					</div>
					</div>
				</div>`;

				document.getElementById(
					`new_container:${roomId}&count:${count}`
				).innerHTML +=
					Res[i]['sender']['name'] === userData['userName']
						? myMsg
						: receivedMsg;
			}
		})
		.catch((error) => console.log(error));
}

//-------scroll event------------
function loadMore(roomId) {
	document.getElementById(`roomId:${roomId}`).addEventListener('wheel', () => {
		if (document.getElementById(`roomId:${roomId}`).scrollTop === 0) {
			if (nextPage == 0) {
				return;
			}
			count++;
			showHistoryMore(roomId, count);
		}
	});
}

//------------Show typing status of user--------------
const fallback = document.querySelector('.fallback');
let userName = '';
userName = userData['userName'];
inputField.addEventListener('keyup', () => {
	socket.emit('typing', {
		isTyping: inputField.value.length > 0,
		nick: userName,
	});
});

socket.on('typing', function (data) {
	const { isTyping, nick } = data;
	if (!isTyping) {
		fallback.innerHTML = '';
		return;
	}

	fallback.innerHTML = `<p>${nick} is typing...</p>`;
});

//------------Delete Friends or Show your friends' saved posts on map----------
const deleteModal = document.getElementById('delete_modal');
const deleteIcon = document.getElementById('delete_bear');

function hideDelete() {
	deleteModal.style.display = 'none';
}
function showFine() {
	deleteIcon.src =
		'https://d3qxlv297wj1rn.cloudfront.net/images/normal-bear.png';
}
function showCry() {
	deleteIcon.src = 'https://d3qxlv297wj1rn.cloudfront.net/images/cry-bear.png';
}
function showSad() {
	deleteIcon.src = 'https://d3qxlv297wj1rn.cloudfront.net/images/sad-bear.png';
}

const yesDeleteButton = document.getElementById('yes-delete-button');
const deleteForm = document.getElementById('delete_form');
const googleMap = document.getElementById('googleMap');

function decideFriendAction(realId, realName, friendGps, deleteFriend) {
	deleteFriend.addEventListener('click', function deleteFriend(ev) {
		ev.preventDefault();

		deleteModal.style.display = 'block';
		document.getElementById('delete_name').value = `"${realName}" ?`;
	});

	friendGps.addEventListener('click', function showFriendPost(ev) {
		ev.preventDefault();

		googleMap.style.display = 'block';
		chatroomContainer.style.display = 'none';
		getFriendPosts(realId);
	});
}

//------------Delete Friends Function------------
yesDeleteButton.addEventListener('click', function deleteConfirm(ev) {
	ev.preventDefault();

	let formData = new FormData(deleteForm);
	const NameInput = new URLSearchParams(formData);
	const jsonData = Object.fromEntries(NameInput.entries());
	const friendsName = jsonData['delete_name'].split(`"`)[1];

	fetch(`/api/user?username=${friendsName}`, {
		method: 'GET',
	})
		.then((Res) => Res.json())
		.then((Res) => {
			const friendId = Res['_id'];
			deleteAction(friendId);
		})
		.catch((error) => console.log(error));
});

function deleteAction(friendId) {
	const bodyData = {
		userId: userId,
		friendId: friendId,
	};

	fetch('/api/friend', {
		method: 'DELETE',
		headers: new Headers({
			'Content-Type': 'application/json;charset=utf-8',
		}),
		body: JSON.stringify(bodyData),
	})
		.then((Res) => Res.json())
		.then((Res) => {
			const okData = Res['ok'];
			if (okData == true) {
				location.reload();
			}
		})
		.catch((error) => console.log(error));
}

//--------------Hide posts modal Function-----------
const postsModal = document.getElementById('posts_modal');
function hidePosts() {
	postsModal.style.display = 'none';
	commentEntireContainer.textContent = '';
}

//----------Heartbeat when mouseover 'likes'--------
function heartBeat() {
	likes.className = 'heart';
}
function heartStop() {
	likes.className = '';
}
