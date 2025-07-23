import customersRepository from '../repositories/customersRepositories.js';

async function getCustomers(cpf) {
	if (cpf) {
		const customers = await customersRepository.getCustomerByCPF(cpf);
		checkCustomers(customers);
		return customers;
	}
	const customers = await customersRepository.getCustomers();
	checkCustomers(customers);
	return customers;
}

async function getCustomerByID(id) {
	const customer = await customersRepository.getCustomerByID(id);
	if (customer.length === 0) {
		const error = { type: 'not_found', message: 'Customer not found' };
		throw error;
	}
	return customer[0];
}

async function createCustomer(name, phone, cpf, birthday) {
	await checkValidCPF(cpf);
	await customersRepository.createCustomer(name, phone, cpf, birthday);
}

async function updateCustomer(customerId, name, phone, cpf, birthday) {
	await checkCustomerExists(customerId);
	await checkValidCPF(cpf);
	await customersRepository.updateCustomer(customerId, name, phone, cpf, birthday);
}

async function deleteCustomer(customerId) {
	await checkCustomerExists(customerId);
	await customersRepository.deleteCustomer(customerId);
}

function checkCustomers(customersArr) {
	if (!Array.isArray(customersArr) || customersArr.length === 0) {
		const error = { type: 'not_found', message: 'Customers not found' };
		throw error;
	}
}

async function checkCustomerExists(customerId) {
	const customer = await customersRepository.getCustomerByID(customerId);
	if (customer.length === 0) {
		const error = { type: 'not_found', message: 'Customer not found' };
		throw error;
	}
}

async function checkValidCPF(cpf) {
	const customer = await customersRepository.getCustomerByCPF(cpf);
	if (customer.length > 0) {
		const error = { type: 'conflict', message: 'Customer with this CPF already exists' };
		throw error;
	}
}

const customersServices = {
	getCustomers,
	getCustomerByID,
	createCustomer,
	updateCustomer,
	deleteCustomer,
};

export default customersServices;
