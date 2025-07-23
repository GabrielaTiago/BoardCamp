import categoriesSchemas from './categoriesSchemas.js';
import newCustomerSchema from './newCustomerSchema.js';
import newGameSchema from './newGameSchema.js';
import rentalSchema from './rentalsSchemas.js';

const schemas = {
	category: categoriesSchemas.newCategorySchema,
	categoryUpdate: categoriesSchemas.updateCategorySchema,
	customer: newCustomerSchema,
	game: newGameSchema,
	rental: rentalSchema,
};

export default schemas;
