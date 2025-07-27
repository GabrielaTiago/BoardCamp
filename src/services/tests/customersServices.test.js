import customersRepositories from '../../repositories/customersRepositories.js';
import customersServices from '../customersServices.js';

jest.mock('../../repositories/customersRepositories.js');

const CUSTOMER_ID_1 = 1;
const NOT_EXISTING_CUSTOMER_ID = 999;

const CUSTOMER_1 = {
	id: 1,
	name: 'John Doe',
	phone: '1234567890',
	cpf: '12345678901',
	birthday: '1990-01-01',
};
const CUSTOMER_2 = {
	id: 2,
	name: 'Jane Smith',
	phone: '0987654321',
	cpf: '10987654321',
	birthday: '1992-02-02',
};
const CUSTOMER_3 = {
	id: 3,
	name: 'Alice Johnson',
	phone: '1122334455',
	cpf: '12323344556',
	birthday: '1995-03-03',
};
const CUSTOMERS = [CUSTOMER_1, CUSTOMER_2, CUSTOMER_3];

const CONFLICT_ERROR = { type: 'conflict', message: 'Customer with this CPF already exists' };
const NOT_FOUND_ERROR = { type: 'not_found', message: 'Customer not found' };

describe('Customers Service', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getCustomers', () => {
		it('should return a list of customers', async () => {
			customersRepositories.getCustomers.mockResolvedValue(CUSTOMERS);

			const result = await customersServices.getCustomers();

			expect(result).toEqual(CUSTOMERS);
			expect(customersRepositories.getCustomers).toHaveBeenCalledTimes(1);
		});

		it('should return a list of customers filtered by cpf', async () => {
			const cpf = '123';
			const filteredCustomers = CUSTOMERS.filter((customer) => customer.cpf.startsWith(cpf));

			customersRepositories.getCustomerByCPF.mockResolvedValue(filteredCustomers);
			const result = await customersServices.getCustomers(cpf);

			expect(result).toEqual(filteredCustomers);
			expect(customersRepositories.getCustomerByCPF).toHaveBeenCalledWith(cpf);
			expect(customersRepositories.getCustomerByCPF).toHaveBeenCalledTimes(1);
		});

		it('should throw a not found error when no customers are found', async () => {
			const expectedError = { type: 'not_found', message: 'Customers not found' };

			customersRepositories.getCustomers.mockResolvedValue([]);

			await expect(customersServices.getCustomers()).rejects.toEqual(expectedError);
			expect(customersRepositories.getCustomers).toHaveBeenCalledTimes(1);
		});
	});

	describe('getCustomerByID', () => {
		it('should return a customer by ID', async () => {
			customersRepositories.getCustomerByID.mockResolvedValue([CUSTOMER_1]);

			const result = await customersServices.getCustomerByID(CUSTOMER_ID_1);

			expect(result).toEqual(CUSTOMER_1);
			expect(customersRepositories.getCustomerByID).toHaveBeenCalledWith(CUSTOMER_ID_1);
		});

		it('should throw a not found error when customer does not exist', async () => {
			customersRepositories.getCustomerByID.mockResolvedValue([]);

			await expect(customersServices.getCustomerByID(NOT_EXISTING_CUSTOMER_ID)).rejects.toEqual(NOT_FOUND_ERROR);
			expect(customersRepositories.getCustomerByID).toHaveBeenCalledWith(NOT_EXISTING_CUSTOMER_ID);
			expect(customersRepositories.getCustomerByID).toHaveBeenCalledTimes(1);
		});
	});

	describe('createCustomer', () => {
		it('should create a new customer successfully', async () => {
			const newCustomer = { name: 'Bob Brown', phone: '1234567890', cpf: '12345678901', birthday: '1990-01-01' };

			customersRepositories.getCustomerByCPF.mockResolvedValue([]);
			customersRepositories.createCustomer.mockResolvedValue();

			await customersServices.createCustomer(newCustomer.name, newCustomer.phone, newCustomer.cpf, newCustomer.birthday);

			expect(customersRepositories.createCustomer).toHaveBeenCalledWith(
				newCustomer.name,
				newCustomer.phone,
				newCustomer.cpf,
				newCustomer.birthday
			);
			expect(customersRepositories.getCustomerByCPF).toHaveBeenCalledWith(newCustomer.cpf);
			expect(customersRepositories.getCustomerByCPF).toHaveBeenCalledTimes(1);
		});

		it('should throw a conflict error if the customer cpf already exists', async () => {
			const existingCustomerCpf = CUSTOMER_1.cpf;

			customersRepositories.getCustomerByCPF.mockResolvedValue([CUSTOMER_1]);

			await expect(
				customersServices.createCustomer(CUSTOMER_1.name, CUSTOMER_1.phone, existingCustomerCpf, CUSTOMER_1.birthday)
			).rejects.toEqual(CONFLICT_ERROR);

			expect(customersRepositories.getCustomerByCPF).toHaveBeenCalledWith(existingCustomerCpf);
		});
	});

	describe('updateCustomer', () => {
		it('should update an existing customer successfully', async () => {
			const updatedCustomer = {
				name: 'John Doe Updated',
				phone: '1234567890',
				cpf: '12345678901',
				birthday: '1990-01-01',
			};

			customersRepositories.getCustomerByID.mockResolvedValue([CUSTOMER_1]);
			customersRepositories.getCustomerByCPF.mockResolvedValue([]);
			customersRepositories.updateCustomer.mockResolvedValue();
			await customersServices.updateCustomer(
				CUSTOMER_ID_1,
				updatedCustomer.name,
				updatedCustomer.phone,
				updatedCustomer.cpf,
				updatedCustomer.birthday
			);

			expect(customersRepositories.updateCustomer).toHaveBeenCalledWith(
				CUSTOMER_ID_1,
				updatedCustomer.name,
				updatedCustomer.phone,
				updatedCustomer.cpf,
				updatedCustomer.birthday
			);
			expect(customersRepositories.getCustomerByID).toHaveBeenCalledWith(CUSTOMER_ID_1);
			expect(customersRepositories.getCustomerByID).toHaveBeenCalledTimes(1);
			expect(customersRepositories.getCustomerByCPF).toHaveBeenCalledWith(updatedCustomer.cpf);
			expect(customersRepositories.getCustomerByCPF).toHaveBeenCalledTimes(1);
		});

		it('should throw a not found error when updating a non-existing customer', async () => {
			const updatedCustomer = {
				name: 'John Doe Updated',
				phone: '1234567890',
				cpf: '12345678901',
				birthday: '1990-01-01',
			};

			customersRepositories.getCustomerByID.mockResolvedValue([]);

			await expect(
				customersServices.updateCustomer(
					NOT_EXISTING_CUSTOMER_ID,
					updatedCustomer.name,
					updatedCustomer.phone,
					updatedCustomer.cpf,
					updatedCustomer.birthday
				)
			).rejects.toEqual(NOT_FOUND_ERROR);
			expect(customersRepositories.getCustomerByID).toHaveBeenCalledWith(NOT_EXISTING_CUSTOMER_ID);
			expect(customersRepositories.getCustomerByID).toHaveBeenCalledTimes(1);
			expect(customersRepositories.updateCustomer).not.toHaveBeenCalled();
		});

		it('should throw a conflict error when updating a customer with an existing cpf', async () => {
			const updatedCustomer = {
				name: 'John Doe Updated',
				phone: '1234567890',
				cpf: CUSTOMER_2.cpf, // This cpf already exists
				birthday: '1990-01-01',
			};

			customersRepositories.getCustomerByID.mockResolvedValue([CUSTOMER_1]);
			customersRepositories.getCustomerByCPF.mockResolvedValue([CUSTOMER_2]);

			await expect(
				customersServices.updateCustomer(
					CUSTOMER_ID_1,
					updatedCustomer.name,
					updatedCustomer.phone,
					updatedCustomer.cpf,
					updatedCustomer.birthday
				)
			).rejects.toEqual(CONFLICT_ERROR);
			expect(customersRepositories.getCustomerByID).toHaveBeenCalledWith(CUSTOMER_ID_1);
			expect(customersRepositories.getCustomerByID).toHaveBeenCalledTimes(1);
			expect(customersRepositories.getCustomerByCPF).toHaveBeenCalledWith(updatedCustomer.cpf);
			expect(customersRepositories.getCustomerByCPF).toHaveBeenCalledTimes(1);
			expect(customersRepositories.updateCustomer).not.toHaveBeenCalled();
		});
	});

	describe('deleteCustomer', () => {
		it('should delete an existing customer successfully', async () => {
			customersRepositories.getCustomerByID.mockResolvedValue([CUSTOMER_1]);
			customersRepositories.deleteCustomer.mockResolvedValue();

			await customersServices.deleteCustomer(CUSTOMER_ID_1);

			expect(customersRepositories.deleteCustomer).toHaveBeenCalledWith(CUSTOMER_ID_1);
			expect(customersRepositories.getCustomerByID).toHaveBeenCalledWith(CUSTOMER_ID_1);
			expect(customersRepositories.getCustomerByID).toHaveBeenCalledTimes(1);
			expect(customersRepositories.deleteCustomer).toHaveBeenCalledTimes(1);
		});

		it('should throw a not found error when trying to delete a non-existing customer', async () => {
			customersRepositories.getCustomerByID.mockResolvedValue([]);

			await expect(customersServices.deleteCustomer(NOT_EXISTING_CUSTOMER_ID)).rejects.toEqual(NOT_FOUND_ERROR);
			expect(customersRepositories.getCustomerByID).toHaveBeenCalledWith(NOT_EXISTING_CUSTOMER_ID);
			expect(customersRepositories.getCustomerByID).toHaveBeenCalledTimes(1);
			expect(customersRepositories.deleteCustomer).not.toHaveBeenCalled();
		});
	});
});
