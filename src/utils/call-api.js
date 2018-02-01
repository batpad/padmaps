const config = require('../config');

module.exports = callAPI;

function callAPI(method, data) {
	const formData = new FormData();
	formData.append('action', method);
	formData.append('data', JSON.stringify(data));
	return fetch(config.api, {
		method: 'POST',
		mode: 'cors',
		body: formData
	})
	.then(response => response.json())
	.then(data => data.data);
}