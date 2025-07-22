import joi from 'joi';

const newCategorySchema = joi.object({
	name: joi.string().required().messages({
		'string.empty': 'Name should not be empty',
		'any.required': 'Name is required',
		'string.base': 'Name must be a string',
	}),
});

const updateCategorySchema = joi.object({
	name: joi.string().required().messages({
		'string.empty': 'Old name should not be empty',
		'any.required': 'Old name is required',
		'string.base': 'Old name must be a string',
	}),
	newName: joi.string().required().messages({
		'string.empty': 'New name should not be empty',
		'any.required': 'New name is required',
		'string.base': 'New name must be a string',
	}),
});

const categoriesSchemas = {
	newCategorySchema,
	updateCategorySchema,
};

export default categoriesSchemas;
