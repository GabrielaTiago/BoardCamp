import schemas from '../schemas/schemas.js';

function validateSchema(schema) {
	if (!schemas[schema]) throw new Error(`Schema ${schema} does not exist`);

	return (req, res, next) => {
		const data = req.body;

		if (!data) return res.status(422).send('Request body is required');

		const { error } = schemas[schema].validate(data, { abortEarly: false });

		if (error) return res.status(422).send(error.details.map((err) => err.message));

		return next();
	};
}

export default validateSchema;
