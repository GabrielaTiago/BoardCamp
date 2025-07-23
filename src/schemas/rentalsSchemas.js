import joi from 'joi';

const rentalSchema = joi.object({
	customerId: joi.number().integer().required().messages({
		'number.base': 'Customer ID must be a number',
		'number.integer': 'Customer ID must be an integer',
		'number.required': 'Customer ID is required',
	}),
	gameId: joi.number().integer().required().messages({
		'number.base': 'Game ID must be a number',
		'number.integer': 'Game ID must be an integer',
		'number.required': 'Game ID is required',
	}),
	daysRented: joi.number().integer().min(1).required().messages({
		'number.min': 'Days rented must be at least 1',
		'number.base': 'Days rented must be a number',
		'number.integer': 'Days rented must be an integer',
		'number.required': 'Days rented is required',
	}),
});

export default rentalSchema;
