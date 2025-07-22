import joi from 'joi';

const newGameSchema = joi.object({
	name: joi.string().required().messages({
		'string.empty': 'Name should not be empty',
		'any.required': 'Name is required',
		'string.base': 'Name must be a string',
	}),
	image: joi.string().required().messages({
		'string.empty': 'Image should not be empty',
		'any.required': 'Image is required',
		'string.base': 'Image must be a string',
	}),
	categoryId: joi.number().integer().required().messages({
		'number.base': 'Category ID must be a number',
		'any.required': 'Category ID is required',
		'number.integer': 'Category ID must be an integer',
	}),
	stockTotal: joi.number().integer().greater(0).required().messages({
		'number.base': 'Stock Total must be a number',
		'any.required': 'Stock Total is required',
		'number.greater': 'Stock Total must be greater than 0',
		'number.integer': 'Stock Total must be an integer',
	}),
	pricePerDay: joi.number().greater(0).required().messages({
		'number.base': 'Price Per Day must be a number',
		'any.required': 'Price Per Day is required',
		'number.greater': 'Price Per Day must be greater than 0',
		'number.integer': 'Price Per Day must be an integer',
	}),
});

export default newGameSchema;
