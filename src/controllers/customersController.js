import customersServices from '../services/customersServices.js';

async function getCustomers(req, res) {
	const { cpf } = req.query;
	const customers = await customersServices.getCustomers(cpf);
	res.status(200).send(customers);
}

async function getCustomerByID(req, res) {
	const { id } = req.params;
	const customer = await customersServices.getCustomerByID(id);
	res.status(200).send(customer);
}

async function createCustomer(req, res) {
	const { name, phone, cpf, birthday } = req.body;
	await customersServices.createCustomer(name, phone, cpf, birthday);
	res.status(201).send({ message: 'Customer created successfully' });
}

async function updateCustomer(req, res) {
	const { id: customerId } = req.params;
	const { name, phone, cpf, birthday } = req.body;
	await customersServices.updateCustomer(customerId, name, phone, cpf, birthday);
	res.status(200).send({ message: 'Customer updated successfully' });
}

async function deleteCustomer(req, res) {
	const { id: customerId } = req.params;
	await customersServices.deleteCustomer(customerId);
	res.status(200).send({ message: 'Customer deleted successfully' });
}

const customersController = {
	getCustomers,
	getCustomerByID,
	createCustomer,
	updateCustomer,
	deleteCustomer,
};

export default customersController;
