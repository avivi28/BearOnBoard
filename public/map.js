function googleAPI() {
	initMap();
	showMarker();
	showAllMarker();
}

let map;

function CenterControl(controlDiv, map) {
	// Set CSS for the control border.
	const controlUI = document.createElement('div');

	controlUI.style.backgroundColor = '#fff';
	controlUI.style.border = '2px solid #fff';
	controlUI.style.borderRadius = '3px';
	controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
	controlUI.style.cursor = 'pointer';
	controlUI.style.marginTop = '8px';
	controlUI.style.marginBottom = '22px';
	controlUI.style.textAlign = 'center';
	controlUI.title = 'Click to find yourself';
	controlDiv.appendChild(controlUI);

	// Set CSS for the control interior.
	const controlText = document.createElement('div');

	controlText.style.color = 'rgb(25,25,25)';
	controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
	controlText.style.fontSize = '16px';
	controlText.style.lineHeight = '38px';
	controlText.style.paddingLeft = '5px';
	controlText.style.paddingRight = '5px';
	controlText.innerHTML = 'Your Location';
	controlUI.appendChild(controlText);
	// Setup the click event listeners: simply set the map to Chicago.
	controlUI.addEventListener('click', () => {
		getPosts();
	});
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
	// Create the search box and link it to the UI element.
	const input = document.getElementById('pac-input');
	const searchBox = new google.maps.places.SearchBox(input);
}

//----------get all saved posts function-------------
function getPosts() {
	fetch('/api/post', { method: 'GET', credentials: 'include' })
		.then((res) => res.json())
		.then((res) => {
			showAllMarker(res);
		});
}

getPosts();

//----------get friends' posts function-------------
function getFriendPosts(friendId) {
	fetch(`/api/post/${friendId}`, { method: 'GET' })
		.then((res) => res.json())
		.then((res) => {
			showFriendsMarker(res);
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

	// Create new control button on map
	const centerControlDiv = document.createElement('div');

	CenterControl(centerControlDiv, map);
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

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

				// Create new control button on map
				const centerControlDiv = document.createElement('div');

				CenterControl(centerControlDiv, map);
				map.controls[google.maps.ControlPosition.TOP_CENTER].push(
					centerControlDiv
				);

				const userIcon = '/images/smaller-icon.png';
				const blackImage = '/images/black-mark.png';
				const pickedMarker = '/images/bear-mark.png';

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
						marker.setIcon(pickedMarker);
						map.setCenter(geoInfo);
						map.setZoom(18);
					});
					marker.addListener('mouseout', () => {
						marker.setIcon(blackImage);
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

const postModal = document.getElementById('posts_modal');
const locationFriendContent = document.getElementById('location-content');
const captionFriendContent = document.getElementById('caption-content');
const friendsPhotos = document.getElementById('friends-photos');
const likes = document.getElementById('likes');
const toolTipText = document.getElementById('tooltiptext');
const commentInput = document.getElementById('comment-input');

function showFriendsMarker(res) {
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

				// Create new control button on map
				const centerControlDiv = document.createElement('div');

				CenterControl(centerControlDiv, map);
				map.controls[google.maps.ControlPosition.TOP_CENTER].push(
					centerControlDiv
				);

				const userIcon = '/images/smaller-icon.png';
				const blackImage = '/images/black-mark.png';
				const pickedMarker = '/images/bear-mark.png';

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
						const postId = res[i]['_id'];
						postModal.style.display = 'block';
						captionFriendContent.textContent = res[i]['caption'];
						friendsPhotos.src = res[i]['img_url'];
						locationFriendContent.textContent = res[i]['location'];
						const likesNumber = res[i]['likes'].length;
						toolTipText.textContent = `${likesNumber} likes`;

						marker.setIcon(pickedMarker);
						map.setCenter(geoInfo);
						map.setZoom(18);

						addLikes(postId, likesNumber);
						addComments(postId);
						showComments(postId);
					});

					marker.addListener('mouseout', () => {
						marker.setIcon(blackImage);
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

//-----------------likes function--------------------
function addLikes(postId, likesNumber) {
	likes.addEventListener('click', () => {
		const bodyData = {
			userId: userId,
			postId: postId,
		};

		fetch('/api/post', {
			method: 'PUT',
			headers: new Headers({
				'Content-Type': 'application/json;charset=utf-8',
			}),
			body: JSON.stringify(bodyData),
		})
			.then((res) => res.json())
			.then((res) => {
				const okData = res['ok'];
				if (okData == true) {
					likes.src = '/images/likes.svg';
					const updateLikes = likesNumber + 1;
					toolTipText.textContent = `${updateLikes} likes`;
				} else {
					likes.src = '/images/unlikes.svg';
					toolTipText.textContent = `${likesNumber} likes`;
				}
			});
	});
}

//---------------Comments function-----------------
const modalContentContainer = document.getElementById('posts-container');
const commentEntireContainer = document.getElementById(
	'comment-entire-container'
);

function showComments(postId) {
	fetch(`/api/comment/${postId}`, {
		method: 'GET',
	})
		.then((res) => res.json())
		.then((res) => {
			for (let i = 0; i < res.length; i++) {
				const commentTextContainer = document.createElement('p');
				commentTextContainer.className = 'comment-text-container';

				const newComment = document.createElement('span');
				newComment.textContent = res[i]['comment'];
				const commenter = document.createElement('strong');
				commenter.textContent = res[i]['commenter']['name'];
				const friendIcon = document.createElement('img');
				friendIcon.src = '/images/friends-icon.png';
				friendIcon.className = 'friends_icon';

				const commentContainer = document.createElement('div');
				commentContainer.className = 'comment-container';

				commentEntireContainer.appendChild(commentContainer);
				commentContainer.appendChild(friendIcon);
				commentContainer.appendChild(commentTextContainer);
				commentTextContainer.appendChild(commenter);
				commentTextContainer.appendChild(newComment);
			}
		});
}

const commentForm = document.getElementById('comment-form');
function addComments(postId) {
	commentInput.addEventListener('keypress', function (event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			let formData = new FormData(commentForm);
			const formInput = new URLSearchParams(formData);
			const jsonData = Object.fromEntries(formInput.entries());
			const comment = jsonData['comment'];

			const bodyData = {
				userId: userId,
				postId: postId,
				comment: comment,
			};

			fetch('/api/comment', {
				method: 'PATCH',
				headers: new Headers({
					'Content-Type': 'application/json;charset=utf-8',
				}),
				body: JSON.stringify(bodyData),
			})
				.then((res) => res.json())
				.then((res) => {
					const okData = res['ok'];
					if (okData == true) {
						commentEntireContainer.textContent = '';
						commentInput.value = '';
						commentInput.textContent = '';
						showComments(postId);
					}
				});
		}
	});
}
