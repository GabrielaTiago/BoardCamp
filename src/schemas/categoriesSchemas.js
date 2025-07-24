import joi from 'joi';

const newCategorySchema = joi.object({
	name: joi.string().required().messages({
		'string.empty': 'Name should not be empty',
		'any.required': 'Name is required',
		'string.base': 'Name must be a string',
	}),
});

const categoriesSchemas = {
	newCategorySchema,
};

export default categoriesSchemas;
