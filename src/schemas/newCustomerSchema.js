import joi from 'joi';

const newCustomerSchema = joi.object({
	name: joi.string().required().messages({
		'string.empty': 'Name should not be empty',
		'any.required': 'Name is required',
		'string.base': 'Name must be a string',
	}),
	phone: joi.string().min(10).max(11).required().messages({
		'string.empty': 'Phone should not be empty',
		'any.required': 'Phone is required',
		'string.base': 'Phone must be a string',
		'string.min': 'Phone must be at least 10 characters long',
		'string.max': 'Phone must be at most 11 characters long',
	}),
	cpf: joi.string().min(11).max(11).required().messages({
		'string.empty': 'CPF should not be empty',
		'any.required': 'CPF is required',
		'string.base': 'CPF must be a string',
		'string.min': 'CPF must be exactly 11 characters long',
		'string.max': 'CPF must be exactly 11 characters long',
	}),
	birthday: joi.date().iso().max('now').min('1900-01-01').required().messages({
		'date.base': 'Birthday must be a valid date',
		'date.iso': 'Birthday must be in ISO format (YYYY-MM-DD)',
		'date.max': 'Birthday cannot be in the future',
		'date.min': 'Birthday must be after January 1, 1900',
		'any.required': 'Birthday is required',
	}),
});

export default newCustomerSchema;
