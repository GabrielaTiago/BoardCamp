import customersServices from './customersServices.js';
import gamesServices from './gamesServices.js';
import rentalsRepositories from '../repositories/rentalsRepositories.js';

async function getRentals(customerId, gameId) {
	let rentals = [];
	if (customerId && gameId) {
		// If both customerId and gameId are provided, filter rentals by both
		await customersServices.getCustomerByID(customerId);
		await gamesServices.getGameById(gameId);
		rentals = await rentalsRepositories.getRentalsByCustomerAndGame(customerId, gameId);
	} else if (customerId && !gameId) {
		// If only customerId is provided, filter rentals by customer
		await customersServices.getCustomerByID(customerId);
		rentals = await rentalsRepositories.getRentalsByCustomer(customerId);
	} else if (!customerId && gameId) {
		// If only gameId is provided, filter rentals by game
		await gamesServices.getGameById(gameId);
		rentals = await rentalsRepositories.getRentalsByGame(gameId);
	} else {
		// If neither is provided, return all rentals
		rentals = await rentalsRepositories.getRentals();
	}

	return rentals.map(_mapRentalsArrayToObject);
}

async function createRental(customerId, gameId, daysRented) {
	// Validate customer and game existence
	await customersServices.getCustomerByID(customerId);
	const game = await gamesServices.getGameById(gameId);

	// Check if the game is available for rent
	const rentedGames = await rentalsRepositories.getRentedGames(gameId);
	const allGamesAreRented = game[0].stockTotal === rentedGames.rowCount;
	if (allGamesAreRented) {
		const error = { type: 'bad_request', message: 'Game is not available for rent' };
		throw error;
	}

	const price = calculateRentalPrice(game[0].pricePerDay, daysRented);
	await rentalsRepositories.createRental(customerId, gameId, daysRented, price);
}

function calculateRentalPrice(pricePerDay, daysRented) {
	return pricePerDay * daysRented;
}

async function returnRental(rentalId) {
	const rental = await checkRentalExists(rentalId);

	// Check if the rental has already been returned
	if (rental.returnDate) {
		const error = { type: 'bad_request', message: 'Rental already returned' };
		throw error;
	}
	const delayFee = calculateDelayFee(rental);
	await rentalsRepositories.returnRental(rentalId, delayFee);
}

async function deleteRental(rentalId) {
	await checkRentalExists(rentalId);
	await rentalsRepositories.deleteRental(rentalId);
}

async function checkRentalExists(rentalId) {
	const rental = await rentalsRepositories.getRentalById(rentalId);
	if (!rental || rental.length === 0) {
		const error = { type: 'not_found', message: 'Rental not found' };
		throw error;
	}
	return rental;
}

function calculateDelayFee(rental) {
	const diff = diffDays(new Date(rental.rentDate), new Date());

	const daysRented = rental.daysRented;
	const pricePerDay = rental.originalPrice / daysRented;

	if (diff > daysRented) {
		const delayDays = diff - daysRented;
		return delayDays * pricePerDay;
	}

	return 0; // No delay fee if returned on time
}

function diffDays(date1, date2) {
	const diffInMs = Math.abs(date2.getTime() - date1.getTime());
	return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

function _mapRentalsArrayToObject(rental) {
	return {
		id: rental.id,
		customerId: rental.customerId,
		gameId: rental.gameId,
		rentDate: rental.rentDate,
		daysRented: rental.daysRented,
		returnDate: rental.returnDate,
		originalPrice: rental.originalPrice,
		delayFee: rental.delayFee,
		customer: {
			id: rental.customerId,
			name: rental.customername,
		},
		game: {
			id: rental.gameId,
			name: rental.gamename,
			categoryId: rental.categoryid,
			categoryName: rental.categoryname,
		},
	};
}

const rentalsServices = {
	getRentals,
	createRental,
	returnRental,
	deleteRental,
};

export default rentalsServices;
