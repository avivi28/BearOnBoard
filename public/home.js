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

//---------Get geo location(lat,log)--------
const noPlace = document.getElementById('no_place');

function getGEO(address) {
	googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBF5RHa0xzEIOLhC-FUYL70lY-vh6xXbmg`;
	return fetch(googleUrl, {
		method: 'GET',
	})
		.then((res) => res.json())
		.then((res) => {
			geoInfo = res['results'][0]['geometry']['location'];
			return geoInfo;
		})
		.catch((e) => {
			if (e instanceof TypeError) {
				noPlace.textContent = 'Sorry...No location found';
				noPlace.className = 'no_place';
				noPlace.style.display = 'block';
				postForm.appendChild(noPlace);
			}
		});
}

//----------------Posts Modal---------------
const modal = document.getElementById('modal');
function addPost() {
	modal.style.display = 'block';
	postForm.style.display = 'block';
	document.getElementById('post-title').style.display = 'block';
	document.getElementById('bear_loader').style.display = 'none';
	document.getElementById('loading').style.display = 'none';

	document.getElementById('img_input').value = '';
	document.getElementById('pac-input').value = '';
	document.getElementById('caption').value = '';
	noPlace.textContent = '';
}
function hidePost() {
	modal.style.display = 'none';
}

function hidePosts() {
	document.getElementById('posts_modal').style.display = 'none';
}

const addPostButton = document.getElementById('add_button');
function showAddPost() {
	add_button.src =
		'https://d3qxlv297wj1rn.cloudfront.net/images/add_post_hover.svg';
}
function leaveAddPost() {
	add_button.src = 'https://d3qxlv297wj1rn.cloudfront.net/images/add_post.svg';
}

// ----------get User info from JWT------------
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

//--------------Add posts function---------------
const postForm = document.querySelector('#postform');
const imageInput = document.querySelector('#img_input');

postForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	if (document.getElementById('no_place')) {
		document.getElementById('no_place').style.display = 'none';
	}

	const form = new FormData(postForm);
	const commentInput = new URLSearchParams(form);
	const postData = Object.fromEntries(commentInput.entries());
	const locationContent = postData['location'];
	let geoInfo = await getGEO(locationContent);
	if (geoInfo == null) {
		geoInfo = null;
		return;
	}

	postForm.style.display = 'none';
	document.getElementById('post-title').style.display = 'none';
	document.getElementById('bear_loader').style.display = 'block';
	document.getElementById('loading').style.display = 'block';

	const file = imageInput.files[0];

	//get secure url from my server
	const { url } = await fetch('/s3Url').then((res) => res.json());

	//post the image directly to the s3 bucket
	await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		body: file,
	});

	const imageUrl = url.split('?')[0];
	const imagePath = imageUrl.split('/')[3];
	const cloudFrontUrl = 'https://d3qxlv297wj1rn.cloudfront.net/' + imagePath;

	const bodyData = {
		userId: userId,
		caption: postData['caption'],
		location: locationContent,
		img_url: cloudFrontUrl,
		lat: geoInfo['lat'],
		lng: geoInfo['lng'],
	};
	await fetch('/api/post', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(bodyData),
		credentials: 'include',
	})
		.then((res) => res.json())
		.then((res) => {
			if (res != null) {
				hidePost();
				showMarker(res);
			}
		})
		.catch((e) => console.log(e));
});

//----------Heartbeat when mouseover 'likes'--------
function heartBeat() {
	likes.className = 'heart';
}
function heartStop() {
	likes.className = '';
}

//----------socke.io----------
const socket = io();

let userName = '';

const newUserConnected = () => {
	userName = userData['userName'];
	socket.emit('newUser', userName);
	// showStatus(userName);
};

newUserConnected();

//----------Show delete posts---------
function deletePost() {
	document.getElementById('delete-post').style.display = 'block';
}
function hideDelete() {
	document.getElementById('delete-post').style.display = 'none';
}

function showdeletePost() {
	document.getElementById('trash_bin').src =
		'https://d3qxlv297wj1rn.cloudfront.net/images/trash_bin_hover.svg';
}

function leavedeletePost() {
	document.getElementById('trash_bin').src =
		'https://d3qxlv297wj1rn.cloudfront.net/images/trash_bin.svg';
}
