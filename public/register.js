const registerForm = document.getElementById('register_form');
const messageReturn = document.getElementById('message_return');
const entireContainer = document.getElementById('login_container');

registerForm.addEventListener('submit', function register(ev) {
	ev.preventDefault();

	let formData = new FormData(registerForm);
	const registerInput = new URLSearchParams(formData);
	const jsonData = Object.fromEntries(registerInput.entries());
	let bodyData = {
		email: jsonData['email'],
		username: jsonData['username'],
		password: jsonData['password'],
	};

	fetch('/api/user', {
		method: 'POST',
		headers: new Headers({
			'Content-Type': 'application/json;charset=utf-8',
		}),
		body: JSON.stringify(bodyData),
	})
		.then((Res) => Res.json())
		.then((Res) => {
			const okData = Res['ok'];
			if (okData == true) {
				messageReturn.textContent = 'Welcome! New Bear!';
				messageReturn.className = 'success_message';
				const successImage = document.querySelector('.success_image');
				successImage.style.display = 'block';
			} else {
				messageReturn.textContent = 'Sorry! Email has been used!';
			}
		})
		.catch((error) => console.log(error));
});
