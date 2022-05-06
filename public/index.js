const loginForm = document.getElementById('login_form');
const messageReturn = document.getElementById('message_return');
const queryString = location.search;
const loginInput = queryString.split('/')[0];
console.log(loginInput);

loginForm.addEventListener('submit', function login(ev) {
	ev.preventDefault();

	let formData = new FormData(loginForm);
	const signInInput = new URLSearchParams(formData);
	const jsonData = Object.fromEntries(signInInput.entries());

	fetch('/api/user', {
		method: 'PATCH',
		headers: new Headers({
			'Content-Type': 'application/json;charset=utf-8',
		}),
		body: JSON.stringify(jsonData),
	})
		.then((Res) => Res.json())
		.then((Res) => {
			const okData = Res['ok'];
			if (okData == true) {
				location.href = '/home';
			} else {
				messageReturn.textContent = 'Oops! Wrong email/password T^T';
				messageReturn.className = 'fail_message';
				messageReturn.style.display = 'block';
			}
		})
		.catch((error) => console.log(error));
});
