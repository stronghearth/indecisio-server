const { NODE_ENV } = require('../config');

function errorHandler(error, req, res, next) {
	let response;
	if (NODE_ENV === 'production') {
		response = { error: { message: error.message } };
	} else {
		console.error(error.message);
		response = { message: error.message, error };
	}
	res.status(500).json(response);
}

module.exports = errorHandler;