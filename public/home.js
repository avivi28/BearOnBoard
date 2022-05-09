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
}
