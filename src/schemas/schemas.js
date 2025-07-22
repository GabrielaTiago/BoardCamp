import categoriesSchemas from './categoriesSchemas.js';
import newCustomerSchema from './newCustomerSchema.js';
import newGameSchema from './newGameSchema.js';

const schemas = {
	category: categoriesSchemas.newCategorySchema,
	categoryUpdate: categoriesSchemas.updateCategorySchema,
	customer: newCustomerSchema,
	game: newGameSchema,
};

export default schemas;
