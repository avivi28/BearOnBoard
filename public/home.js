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

function googleAPI() {
	initMap();
	getGEO();
}

function initMap() {
	infoWindow = new google.maps.InfoWindow();
	const map = new google.maps.Map(document.getElementById('googleMap'), {
		zoom: 18,
		center: {
			lat: 25.0336962,
			lng: 121.5643673,
		},
		fullscreenControl: false,
		streetViewControl: false, //remove the default button
		mapTypeControl: false,
		styles: [
			{
				featureType: 'poi.business',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
			{
				featureType: 'poi.park',
				elementType: 'labels.text',
				stylers: [
					{
						visibility: 'off',
					},
				],
			},
		],
	});
	//get current location
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};

				const image = '/images/bear-mark.png';

				const marker = new google.maps.Marker({
					position: pos,
					map: map,
					icon: image,
					animation: google.maps.Animation.BOUNCE,
				});

				map.setCenter(pos);
			},
			() => {
				handleLocationError(true, infoWindow, map.getCenter());
			}
		);
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}

	// Create the search box and link it to the UI element.
	const input = document.getElementById('pac-input');
	const searchBox = new google.maps.places.SearchBox(input);

	map.push(input);
}

window.initMap = initMap;

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

//--------------Add posts function---------------
const postForm = document.querySelector('#postform');
const imageInput = document.querySelector('#img_input');

postForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	const form = new FormData(postForm);
	const commentInput = new URLSearchParams(form);
	const postData = Object.fromEntries(commentInput.entries());
	const locationContent = postData['location'];
	const geoResult = await getGEO(locationContent);

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
			if (res['ok'] == true) {
				hidePost();
			}
		})
		.catch((e) => console.log(e));
});
