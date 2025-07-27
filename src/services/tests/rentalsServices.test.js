import customersServices from '../customersServices.js';
import gamesServices from '../gamesServices.js';
import rentalsRepositories from '../../repositories/rentalsRepositories.js';
import rentalsServices from '../rentalsServices.js';

jest.mock('../../repositories/rentalsRepositories.js');
jest.mock('../gamesServices.js');
jest.mock('../customersServices.js');

const NOT_EXISTING_RENTAL_ID = 999;

const RENTAL_1 = {
	id: 1,
	customerId: 1,
	gameId: 1,
	rentDate: '2023-10-01',
	daysRented: 5,
	returnDate: null,
	originalPrice: 25.0,
	delayFee: null,
};

const RAW_RENTAL_1 = {
	id: 1,
	customerId: 1,
	gameId: 1,
	rentDate: '2023-10-01',
	daysRented: 5,
	returnDate: null,
	originalPrice: 25.0,
	delayFee: null,
	customername: 'John Doe',
	gamename: 'Banco Imobiliario',
	categoryid: 1,
	categoryname: 'Board Games',
};

const MAPPED_RENTAL_1 = {
	id: 1,
	customerId: 1,
	gameId: 1,
	rentDate: '2023-10-01',
	daysRented: 5,
	returnDate: null,
	originalPrice: 25.0,
	delayFee: null,
	customer: { id: 1, name: 'John Doe' },
	game: { id: 1, name: 'Banco Imobiliario', categoryId: 1, categoryName: 'Board Games' },
};

describe('Rentals Service', () => {
	beforeAll(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2025-07-27T18:00:00Z'));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getRentals', () => {
		it('should return a list of rentals', async () => {
			rentalsRepositories.getRentals.mockResolvedValue([RAW_RENTAL_1]);
			const result = await rentalsServices.getRentals();

			expect(result).toEqual([MAPPED_RENTAL_1]);
			expect(rentalsRepositories.getRentals).toHaveBeenCalledTimes(1);
		});

		it('should return rentals filtered by gameId', async () => {
			const gameId = 1;

			gamesServices.getGameById.mockResolvedValue();
			rentalsRepositories.getRentalsByGame.mockResolvedValue([RAW_RENTAL_1]);
			const result = await rentalsServices.getRentals(null, gameId);

			expect(result).toEqual([MAPPED_RENTAL_1]);
			expect(gamesServices.getGameById).toHaveBeenCalledWith(gameId);
			expect(rentalsRepositories.getRentalsByGame).toHaveBeenCalledWith(gameId);
		});

		it('should return rentals filtered by customerId', async () => {
			const customerId = 1;

			customersServices.getCustomerByID.mockResolvedValue();
			rentalsRepositories.getRentalsByCustomer.mockResolvedValue([RAW_RENTAL_1]);
			const result = await rentalsServices.getRentals(customerId, null);

			expect(result).toEqual([MAPPED_RENTAL_1]);
			expect(customersServices.getCustomerByID).toHaveBeenCalledWith(customerId);
			expect(rentalsRepositories.getRentalsByCustomer).toHaveBeenCalledWith(customerId);
		});

		it('should return rentals filtered by both customerId and gameId', async () => {
			const customerId = 1;
			const gameId = 1;

			customersServices.getCustomerByID.mockResolvedValue();
			gamesServices.getGameById.mockResolvedValue();
			rentalsRepositories.getRentalsByCustomerAndGame.mockResolvedValue([RAW_RENTAL_1]);

			const result = await rentalsServices.getRentals(customerId, gameId);

			expect(customersServices.getCustomerByID).toHaveBeenCalledWith(customerId);
			expect(gamesServices.getGameById).toHaveBeenCalledWith(gameId);
			expect(rentalsRepositories.getRentalsByCustomerAndGame).toHaveBeenCalledWith(customerId, gameId);
			expect(rentalsRepositories.getRentalsByCustomerAndGame).toHaveBeenCalledTimes(1);
			expect(result).toEqual([MAPPED_RENTAL_1]);
		});
	});

	describe('createRental', () => {
		it('should create a rental successfully when game is in stock', async () => {
			const rentalInput = { customerId: 1, gameId: 1, daysRented: 3 };
			const mockGame = { id: 1, stockTotal: 5, pricePerDay: 1000 };
			const expectedPrice = mockGame.pricePerDay * rentalInput.daysRented;

			customersServices.getCustomerByID.mockResolvedValue();
			gamesServices.getGameById.mockResolvedValue([mockGame]);
			rentalsRepositories.getRentedGames.mockResolvedValue({ rowCount: 2 });
			rentalsRepositories.createRental.mockResolvedValue();

			await rentalsServices.createRental(rentalInput.customerId, rentalInput.gameId, rentalInput.daysRented);

			expect(rentalsRepositories.createRental).toHaveBeenCalledTimes(1);
			expect(rentalsRepositories.createRental).toHaveBeenCalledWith(
				rentalInput.customerId,
				rentalInput.gameId,
				rentalInput.daysRented,
				expectedPrice
			);
		});

		it('should throw a bad_request error when game is out of stock', async () => {
			const rentalInput = { customerId: 1, gameId: 1, daysRented: 3 };
			const mockGame = { id: 1, stockTotal: 5, pricePerDay: 1000 };
			const expectedError = { type: 'bad_request', message: 'Game is not available for rent' };

			customersServices.getCustomerByID.mockResolvedValue();
			gamesServices.getGameById.mockResolvedValue([mockGame]);
			rentalsRepositories.getRentedGames.mockResolvedValue({ rowCount: 5 });

			await expect(rentalsServices.createRental(rentalInput.customerId, rentalInput.gameId, rentalInput.daysRented)).rejects.toEqual(
				expectedError
			);
			expect(rentalsRepositories.createRental).not.toHaveBeenCalled();
		});
	});

	describe('returnRental', () => {
		it('should calculate the correct delay fee and finalize the rental', async () => {
			const rentalId = 1;
			const mockLateRental = {
				id: rentalId,
				rentDate: '2025-07-17T18:00:00Z',
				daysRented: 5,
				returnDate: null,
				originalPrice: 5000,
			};
			const expectedDelayFee = 5000;

			rentalsRepositories.getRentalById.mockResolvedValue([mockLateRental]);
			rentalsRepositories.returnRental.mockResolvedValue();
			await rentalsServices.returnRental(rentalId);

			expect(rentalsRepositories.returnRental).toHaveBeenCalledTimes(1);
			expect(rentalsRepositories.returnRental).toHaveBeenCalledWith(rentalId, expectedDelayFee);
		});

		it('should finalize the rental with a delay fee of 0 if returned on time', async () => {
			const rentalId = 2;
			const mockOnTimeRental = {
				id: rentalId,
				rentDate: '2025-07-24T18:00:00Z',
				daysRented: 5,
				returnDate: null,
				originalPrice: 5000,
			};

			rentalsRepositories.getRentalById.mockResolvedValue([mockOnTimeRental]);
			rentalsRepositories.returnRental.mockResolvedValue();

			await rentalsServices.returnRental(rentalId);

			expect(rentalsRepositories.returnRental).toHaveBeenCalledWith(rentalId, 0);
			expect(rentalsRepositories.returnRental).toHaveBeenCalledTimes(1);
		});

		it('should throw a bad_request error if the rental has already been returned', async () => {
			const rentalId = 1;
			const mockAlreadyReturnedRental = {
				id: rentalId,
				rentDate: '2025-07-20T12:00:00Z',
				daysRented: 5,
				returnDate: '2025-07-25T12:00:00Z',
				originalPrice: 5000,
			};
			const expectedError = { type: 'bad_request', message: 'Rental already returned' };

			rentalsRepositories.getRentalById.mockResolvedValue([mockAlreadyReturnedRental]);

			await expect(rentalsServices.returnRental(rentalId)).rejects.toEqual(expectedError);
			expect(rentalsRepositories.returnRental).not.toHaveBeenCalled();
		});
	});

	describe('deleteRental', () => {
		it('should delete a rental successfully', async () => {
			const rentalId = 1;

			rentalsRepositories.getRentalById.mockResolvedValue([RENTAL_1]);
			rentalsRepositories.deleteRental.mockResolvedValue();

			await rentalsServices.deleteRental(rentalId);

			expect(rentalsRepositories.getRentalById).toHaveBeenCalledWith(rentalId);
			expect(rentalsRepositories.deleteRental).toHaveBeenCalledWith(rentalId);
		});

		it('should throw a not_found error when rental does not exist', async () => {
			const expectedError = { type: 'not_found', message: 'Rental not found' };

			rentalsRepositories.getRentalById.mockResolvedValue([]);

			await expect(rentalsServices.deleteRental(NOT_EXISTING_RENTAL_ID)).rejects.toEqual(expectedError);
			expect(rentalsRepositories.getRentalById).toHaveBeenCalledWith(NOT_EXISTING_RENTAL_ID);
			expect(rentalsRepositories.deleteRental).not.toHaveBeenCalled();
		});
	});
});
