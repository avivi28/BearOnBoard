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
	showMarker();
	showAllMarker();
}

const mapStyles = [
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
];
function initMap(map) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};

				map = new google.maps.Map(document.getElementById('googleMap'), {
					zoom: 18,
					center: pos,
					fullscreenControl: false,
					streetViewControl: false, //remove the default button
					mapTypeControl: false,
					styles: mapStyles,
				});
				const userIcon = '/images/smaller-icon.png';

				const marker = new google.maps.Marker({
					position: pos,
					map: map,
					icon: userIcon,
					animation: google.maps.Animation.BOUNCE,
				});

				// Create the search box and link it to the UI element.
				const input = document.getElementById('pac-input');
				const searchBox = new google.maps.places.SearchBox(input);

				map.push(input);

				map.setCenter(pos);
				return map;
			},
			() => {
				handleLocationError(true, infoWindow, map.getCenter());
			}
		);
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
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

//----------get all saved posts function-------------
function getPosts() {
	fetch('/api/post', { method: 'GET', credentials: 'include' })
		.then((res) => res.json())
		.then((res) => {
			showAllMarker(res);
		});
}

//---------------show marker after add new post------------------
const locationContent = document.getElementById('location_content');
const caption = document.getElementById('caption_content');
const postPhoto = document.getElementById('post_image');

function showMarker(res) {
	const newGeo = {
		lat: res['lat'],
		lng: res['lng'],
	};
	const map = new google.maps.Map(document.getElementById('googleMap'), {
		zoom: 18,
		center: newGeo,
		fullscreenControl: false,
		streetViewControl: false, //remove the default button
		mapTypeControl: false,
		styles: mapStyles,
	});

	const pickedMarker = '/images/bear-mark.png';
	const marker = new google.maps.Marker({
		position: newGeo,
		map: map,
		icon: pickedMarker,
		animation: google.maps.Animation.DROP,
	});
	fetch('/api/post', { method: 'GET', credentials: 'include' })
		.then((res) => res.json())
		.then((res) => {
			marker.addListener('click', () => {
				const lastPost = res.length - 1;
				caption.textContent = res[lastPost]['caption'];
				postPhoto.src = res[lastPost]['img_url'];
				locationContent.textContent = res[lastPost]['location'];
			});
		});
}

function showAllMarker(res) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};

				const map = new google.maps.Map(document.getElementById('googleMap'), {
					zoom: 18,
					center: pos,
					fullscreenControl: false,
					streetViewControl: false, //remove the default button
					mapTypeControl: false,
					styles: mapStyles,
				});

				const userIcon = '/images/smaller-icon.png';
				const blackImage = '/images/black-mark.png';

				const Currentmarker = new google.maps.Marker({
					position: pos,
					map: map,
					icon: userIcon,
					animation: google.maps.Animation.BOUNCE,
				});

				for (let i = 0; i < res.length; i++) {
					const geoInfo = {
						lat: res[i]['lat'],
						lng: res[i]['lng'],
					};

					const marker = new google.maps.Marker({
						position: geoInfo,
						map: map,
						icon: blackImage,
						animation: google.maps.Animation.DROP,
					});

					marker.addListener('click', () => {
						caption.textContent = res[i]['caption'];
						postPhoto.src = res[i]['img_url'];
						locationContent.textContent = res[i]['location'];
						map.setCenter(geoInfo);
						map.setZoom(18);
					});
				}
			},
			() => {
				handleLocationError(true, infoWindow, map.getCenter());
			}
		);
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
}
