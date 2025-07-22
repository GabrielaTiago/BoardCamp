import { connection } from '../databases/postgres.js';

async function getCategories() {
	const { rows: allCategories } = await connection.query('SELECT * FROM categories');
	return allCategories;
}

async function getCategoryByName(name) {
	const category = await connection.query('SELECT * FROM categories WHERE name = $1', [name]);
	return category;
}

async function createCategory(name) {
	await connection.query('INSERT INTO categories (name) VALUES ($1)', [name]);
}

async function updateCategory(oldName, newName) {
	await connection.query('UPDATE categories SET name = $1 WHERE name = $2', [newName, oldName]);
}

async function deleteCategory(name) {
	await connection.query('DELETE FROM categories WHERE name = $1', [name]);
}

const categoriesRepositories = {
	getCategories,
	getCategoryByName,
	createCategory,
	updateCategory,
	deleteCategory,
};

export default  categoriesRepositories;
