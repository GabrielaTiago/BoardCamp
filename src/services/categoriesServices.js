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
	const existingCategory = await categoriesRepositories.getCategoryByName(name);
	if (existingCategory.rowCount > 0) {
		const error = { type: 'conflict', message: 'Category already exists' };
		throw error;
	}
	await categoriesRepositories.createCategory(name);
}

async function updateCategory(oldName, newName) {
	await checksTheExistenceOfTheCategory(oldName);
	await categoriesRepositories.updateCategory(oldName, newName);
}

async function deleteCategory(name) {
	await checksTheExistenceOfTheCategory(name);
	await categoriesRepositories.deleteCategory(name);
}

async function checksTheExistenceOfTheCategory(name) {
	const existingCategory = await categoriesRepositories.getCategoryByName(name);
	if (existingCategory.rowCount === 0) {
		const error = { type: 'not_found', message: 'Category not found' };
		throw error;
	}
}

const categoriesServices = {
	getCategories,
	createCategory,
	updateCategory,
	deleteCategory,
};

export default categoriesServices;
