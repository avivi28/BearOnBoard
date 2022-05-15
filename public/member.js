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

function postFriend(Res) {
	const bodyData = {
		userId: userId,
		friendId: Res['_id'],
	};

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
				confirmIcon.style.display = 'none';
				newIcon.src = '/images/sad-bear.png';
				newIcon.style.display = 'block';
				bearContainer.appendChild(newIcon);
				buttonContainer.style.display = 'none';
				confirmText.textContent = 'This friend has been added!';
			} else {
				confirmIcon.style.display = 'none';
				newIcon.src = '/images/request-bear.png';
				newIcon.style.display = 'block';
				bearContainer.appendChild(newIcon);
				buttonContainer.style.display = 'none';
				confirmText.textContent = 'Request has been sent!';
			}
		})
		.catch((error) => console.log(error));
}

//------------Chat room System------------
const socket = io('http://localhost:9090');
console.log(socket);
