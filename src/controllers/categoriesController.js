import categoriesServices from '../services/categoriesServices.js';

async function getCategoriesController(_, res) {
	const allCategories = await categoriesServices.getCategories();
	res.status(200).send(allCategories);
}

async function createCategoryController(req, res) {
	const { name } = req.body;
	await categoriesServices.createCategory(name);
	res.status(201).send('Category created successfully');
}

async function updateCategoryController(req, res) {
	const { name, newName } = req.body;
	await categoriesServices.updateCategory(name, newName);
	res.status(200).send('Category updated successfully');
}

async function deleteCategoryController(req, res) {
	const { name } = req.params;
	await categoriesServices.deleteCategory(name);
	res.status(200).send('Category deleted successfully');
}

export { getCategoriesController, createCategoryController, updateCategoryController, deleteCategoryController };
