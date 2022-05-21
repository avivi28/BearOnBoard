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
function getGEO(address) {
	googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBF5RHa0xzEIOLhC-FUYL70lY-vh6xXbmg`;
	return fetch(googleUrl, {
		method: 'GET',
	})
		.then((res) => res.json())
		.then((res) => {
			geoInfo = res['results'][0]['geometry']['location'];
			return geoInfo;
		});
}

//----------------Posts Modal---------------
const modal = document.getElementById('modal');
function addPost() {
	modal.style.display = 'block';
}
function hidePost() {
	modal.style.display = 'none';
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
	const form = new FormData(postForm);
	const commentInput = new URLSearchParams(form);
	const postData = Object.fromEntries(commentInput.entries());
	const locationContent = postData['location'];
	const geoInfo = await getGEO(locationContent);
	if (geoInfo == null) {
		geoInfo = null;
	}

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
	}).then((res) => {
		console.log(res);
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

//----------socke.io----------
const socket = io('http://localhost:9090');
console.log(socket);

let userName = '';

const newUserConnected = () => {
	userName = userData['userName'];
	socket.emit('new user', userName);
	showStatus(userName);
};

newUserConnected();
