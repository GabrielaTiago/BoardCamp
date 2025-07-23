import { connection } from '../databases/postgres.js';

async function getCustomers() {
	const { rows: allCustomers } = await connection.query('SELECT * FROM customers');
	return allCustomers;
}

async function getCustomerByID(id) {
	const { rows: customer } = await connection.query(`SELECT * FROM customers WHERE id = $1`, [id]);
	return customer;
}

async function getCustomerByCPF(cpf) {
	const { rows: customer } = await connection.query(`SELECT * FROM customers WHERE cpf LIKE $1`, [`${cpf}%`]);
	return customer;
}

async function createCustomer(name, phone, cpf, birthday) {
	await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday]);
}

async function updateCustomer(customerId, name, phone, cpf, birthday) {
	await connection.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`, [
		name,
		phone,
		cpf,
		birthday,
		customerId,
	]);
}

async function deleteCustomer(customerId) {
	await connection.query(`DELETE FROM customers WHERE id = $1`, [customerId]);
}

const customersRepository = {
	getCustomers,
	getCustomerByID,
	getCustomerByCPF,
	createCustomer,
	updateCustomer,
	deleteCustomer,
};

export default customersRepository;
