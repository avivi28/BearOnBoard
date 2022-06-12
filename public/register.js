const registerForm = document.getElementById('register_form');
const messageReturn = document.getElementById('message_return');
const entireContainer = document.getElementById('login_container');
const successImage = document.querySelector('.success_image');
const emailInput = document.getElementById('email');
const userNameInput = document.getElementById('username');
const pwInput = document.getElementById('password');
const paws = document.querySelector('paws_container');

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
			const idData = Res['id'];
			if (okData == true) {
				messageReturn.textContent = 'Welcome! New Bear!';
				messageReturn.className = 'success_message';
				successImage.style.display = 'block';
				emailInput.value = '';
				userNameInput.value = '';
				pwInput.value = '';
				addFriendBot(idData);
			} else {
				messageReturn.textContent = 'Sorry! Email has been used!';
				successImage.style.display = 'none';
				messageReturn.className = 'fail_message';
			}
		})
		.catch((error) => console.log(error));
});

//------adding default friend for user to test-----
function addFriendBot(idData) {
	const bodyData = {
		userId: idData,
		friendId: '628b2e8340cb83fbf83b7c2d', // userId of 'test'
		status: 1,
	};

	fetch('/api/friend', {
		method: 'PUT',
		headers: new Headers({
			'Content-Type': 'application/json;charset=utf-8',
		}),
		body: JSON.stringify(bodyData),
	})
		.then((Res) => Res.json())
		.catch((error) => console.log(error));
}
