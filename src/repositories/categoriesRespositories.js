import { connection } from '../databases/postgres.js';

async function getCategories() {
	const { rows: allCategories } = await connection.query('SELECT * FROM categories');
	return allCategories;
}

async function getCategorieById(id) {
	const category = await connection.query('SELECT * FROM categories WHERE id = $1', [id]);
	return category;
}

async function getCategoryByName(name) {
	const category = await connection.query('SELECT * FROM categories WHERE name = $1', [name]);
	return category;
}

async function createCategory(name) {
	await connection.query('INSERT INTO categories (name) VALUES ($1)', [name]);
}

async function updateCategory(newName, categoryId) {
	await connection.query('UPDATE categories SET name = $1 WHERE id = $2', [newName, categoryId]);
}

async function deleteCategory(name) {
	await connection.query('DELETE FROM categories WHERE name = $1', [name]);
}

const categoriesRepositories = {
	getCategories,
	getCategorieById,
	getCategoryByName,
	createCategory,
	updateCategory,
	deleteCategory,
};

export default categoriesRepositories;
