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
	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', () => {
		searchBox.setBounds(map.getBounds());
	});

	let markers = [];

	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', () => {
		const places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

		// Clear out the old markers.
		markers.forEach((marker) => {
			marker.setMap(null);
		});
		markers = [];

		// For each place, get the icon, name and location.
		const bounds = new google.maps.LatLngBounds();

		places.forEach((place) => {
			if (!place.geometry || !place.geometry.location) {
				console.log('Returned place contains no geometry');
				return;
			}

			const icon = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25),
			};

			// Create a marker for each place.
			markers.push(
				new google.maps.Marker({
					map,
					icon,
					title: place.name,
					position: place.geometry.location,
				})
			);
			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		map.fitBounds(bounds);
	});
}

window.initMap = initMap;

//----------------Posts Modal---------------
const modal = document.getElementById('modal');
function addPost() {
	modal.style.display = 'block';
}
function hidePost() {
	modal.style.display = 'none';
}
