import categoriesRepositories from '../repositories/categoriesRespositories.js';

async function getCategories() {
	const result = await categoriesRepositories.getCategories();
	if (!result || result.length === 0) {
		const error = { type: 'not_found', message: 'No categories found' };
		throw error;
	}
	return result;
}

async function createCategory(name) {
	await checksTheNameAlreadyExists(name);
	await categoriesRepositories.createCategory(name);
}

async function updateCategory(name, id) {
	await checkTheCategoryExistence(id);
	await checksTheNameAlreadyExists(name);
	await categoriesRepositories.updateCategory(name, id);
}

async function deleteCategory(id) {
	await checkTheCategoryExistence(id);
	await categoriesRepositories.deleteCategory(id);
}

async function checkTheCategoryExistence(id) {
	const category = await categoriesRepositories.getCategorieById(id);
	if (category.rowCount === 0) {
		const error = { type: 'not_found', message: 'Category not found' };
		throw error;
	}
	return category.rows[0];
}

async function checksTheNameAlreadyExists(name) {
	const category = await categoriesRepositories.getCategoryByName(name);
	if (category.rowCount > 0) {
		const error = { type: 'conflict', message: `Category name '${name}' already exists` };
		throw error;
	}
	return category.rows[0];
}

const categoriesServices = {
	getCategories,
	createCategory,
	updateCategory,
	deleteCategory,
};

export default categoriesServices;
