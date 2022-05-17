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
	confirmIcon.src = '/images/normal-bear.png';
}
function showHappy() {
	confirmIcon.src = '/images/happy-bear.png';
}
function showShock() {
	confirmIcon.src = '/images/cancel-bear.png';
}

friendsForm.addEventListener('submit', function confirm(ev) {
	ev.preventDefault();
	confirmModal.style.display = 'block';
	buttonContainer.style.display = 'inherit';
	confirmIcon.style.display = 'inherit';
	newIcon.style.display = 'none';
	reasonText.style.display = 'none';

	let formData = new FormData(friendsForm);
	const NameInput = new URLSearchParams(formData);
	const jsonData = Object.fromEntries(NameInput.entries());
	const friendsName = jsonData['username'];

	confirmText.textContent = `Add "${friendsName}" ?`;

	sendRequest(friendsName);
});

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

//------------Friends Request System------------
const yesButton = document.getElementById('yes-button');

function sendRequest(friendsName) {
	yesButton.addEventListener('click', function getId(ev) {
		ev.preventDefault();

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
					newIcon.src = '/images/request-bear.png';
					newIcon.style.display = 'block';
					bearContainer.appendChild(newIcon);
					buttonContainer.style.display = 'none';
					confirmText.textContent = 'Request has been sent!';
				}
			})
			.catch((error) => console.log(error));
	}
}

function showFailResult() {
	confirmIcon.style.display = 'none';
	newIcon.src = '/images/sad-bear.png';
	newIcon.style.display = 'block';
	bearContainer.appendChild(newIcon);
	buttonContainer.style.display = 'none';
	confirmText.textContent = `Sorry, you can't send this request!`;
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

const yesConfirmButton = document.createElement('button');
const noConfirmButton = document.createElement('button');
const pendingContainer = document.createElement('p');
function showPending(Res) {
	pendingContainer.className = 'pending_container';
	const friendImage = document.createElement('img');
	friendImage.src = '/images/friends-icon.png';

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

	for (let i = 0; i < Res.length; i++) {
		const friendId = Res[i]['sender']['_id'];
		const friendData = Res[i]['sender']['name'];
		friendName.textContent = `Name: ${friendData}`;
		pendingMessage.textContent = 'Incoming Friend Request';

		pendingContainer.appendChild(friendImage);
		pendingContainer.appendChild(pendingContentContainer);
		pendingContentContainer.appendChild(friendName);
		pendingContentContainer.appendChild(pendingMessage);
		pendingContainer.appendChild(buttonContainer);
		buttonContainer.appendChild(yesConfirmButton);
		buttonContainer.appendChild(noConfirmButton);
		decideRequest(friendId);
	}

	pendingList.appendChild(pendingContainer);
}

getPending();

//------Accept or Reject the friend request------
function decideRequest(friendId) {
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
		ev.preventDefault(); //change to use delete method
		const bodyData = {
			userId: friendId, // request sender
			friendId: userId, // request receiver
			status: -1,
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
					pendingContainer.style.display = 'none';
				}
			})
			.catch((error) => console.log(error));
	});
}

//------------Show Friends lists----------
function getFriendLists() {
	fetch(`/api/user/${userId}`, {
		method: 'GET',
	})
		.then((Res) => Res.json())
		.then((Res) => {
			console.log(Res);
			showFriendLists(Res);
		})
		.catch((error) => console.log(error));
}
getFriendLists();

const friendContainer = document.getElementById('friendslist_container');

function showFriendLists(Res) {
	for (let j = 0; j < Res['friends'].length; j++) {
		const detailContainer = document.createElement('div');
		detailContainer.className = 'detail-container';
		const nameContainer = document.createElement('p');
		nameContainer.className = 'name-container';
		const clickContainer = document.createElement('p');
		clickContainer.className = 'click-container';

		const friendImage = document.createElement('img');
		friendImage.src = '/images/friends-icon.png';
		friendImage.setAttribute('id', 'friends_icon');
		const friendName = document.createElement('p');
		friendName.className = 'friends_name';
		const friendBio = document.createElement('p');
		friendBio.className = 'friends_bio';

		const friendGps = document.createElement('img');
		friendGps.src = '/images/friends_gps.svg';
		friendGps.setAttribute('id', 'friends_jps');
		friendGps.setAttribute('alt', 'locate');
		const deleteFriend = document.createElement('img');
		deleteFriend.src = '/images/delete_friends.svg';
		deleteFriend.setAttribute('id', 'friends_delete');
		deleteFriend.setAttribute('alt', 'delete');

		const realName = Res['friends'][j]['name'];
		const realId = Res['friends'][j]['_id'];

		friendName.textContent = `Name: ${realName}`;
		friendBio.textContent = `Let's be fluffy!`;

		friendContainer.appendChild(detailContainer);
		detailContainer.appendChild(friendImage);
		detailContainer.appendChild(nameContainer);
		detailContainer.appendChild(clickContainer);
		nameContainer.appendChild(friendName);
		nameContainer.appendChild(friendBio);
		clickContainer.appendChild(friendGps);
		clickContainer.appendChild(deleteFriend);

		decideFriendAction(realName, friendGps, deleteFriend);
	}
}

//------------Delete Friends or Show your friends' saved posts on map----------
const deleteModal = document.getElementById('delete_modal');
const deleteIcon = document.getElementById('delete_bear');

function hideDelete() {
	deleteModal.style.display = 'none';
}
function showFine() {
	deleteIcon.src = '/images/normal-bear.png';
}
function showCry() {
	deleteIcon.src = '/images/cry-bear.png';
}
function showSad() {
	deleteIcon.src = '/images/sad-bear.png';
}

const yesDeleteButton = document.getElementById('yes-delete-button');
const deleteForm = document.getElementById('delete_form');

function decideFriendAction(realName, friendGps, deleteFriend) {
	deleteFriend.addEventListener('click', function deleteFriend(ev) {
		ev.preventDefault();

		deleteModal.style.display = 'block';
		document.getElementById('delete_name').value = `"${realName}" ?`;
	});
}

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

	console.log(bodyData);

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

//------------Chat room System------------
const socket = io('http://localhost:9090');
console.log(socket);
