import ERRORS from '../errors/serverErrors.js';

function errorHandler(error, req, res, next) {
	const { type, message } = error;
	const statusCode = ERRORS[type];

	if (statusCode) {
		return res.status(statusCode).send(message);
	}

	console.error(error);
	res.status(ERRORS.internal_server_error).send('Internal Server Error');
}

export default errorHandler;
