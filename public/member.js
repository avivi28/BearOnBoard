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
const friendsForm = document.getElementById('friendform');
const noResult = document.createElement('p');
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
				noResult.className = 'no_found';
				noResult.style.display = 'block';
				friendsForm.appendChild(noResult);
				return;
			} else {
				payload.forEach((item, index) => {
					noResult.style.display = 'none';
					searchResults.innerHTML += `<option>${item.name}</option>`;
					return;
				});
			}
		});
	return;
}

//------------Friends Request System------------
const socket = io('http://localhost:9090');
console.log(socket);
