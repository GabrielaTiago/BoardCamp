import { connection } from '../databases/postgres.js';

const BASE_SQL = `
SELECT
	r.*,
	c.name AS customerName,
	g.name AS gameName,
	cat.id AS categoryId,
	cat.name AS categoryName
FROM rentals r
JOIN customers c ON r."customerId" = c.id
JOIN games g ON r."gameId" = g.id
JOIN categories cat ON g."categoryId" = cat.id
`;

async function getRentals() {
	const { rows: rentals } = await connection.query(BASE_SQL);
	return rentals;
}

async function getRentalsByCustomer(customerId) {
	const { rows: rentals } = await connection.query(
		`${BASE_SQL}
		WHERE r."customerId" = $1`,
		[customerId]
	);
	return rentals;
}

async function getRentalsByGame(gameId) {
	const { rows: rentals } = await connection.query(
		`${BASE_SQL}
        WHERE r."gameId" = $1`,
		[gameId]
	);
	return rentals;
}

async function getRentalsByCustomerAndGame(customerId, gameId) {
	const { rows: rentals } = await connection.query(
		`${BASE_SQL}
		WHERE r."customerId" = $1 AND r."gameId" = $2`,
		[customerId, gameId]
	);
	return rentals;
}

async function getRentalById(rentalId) {
	const { rows: rental } = await connection.query('SELECT * FROM rentals WHERE id = $1', [rentalId]);
	return rental;
}

async function getRentedGames(gameId) {
	const games = await connection.query('SELECT id FROM rentals WHERE gameId = $1 AND returnDate IS NULL', [gameId]);
	return games;
}

async function createRental(customerId, gameId, daysRented, originalPrice) {
	await connection.query(
		`
        INSERT INTO rentals ("customerId", "gameId", "daysRented", "originalPrice", "rentDate", "returnDate", "delayFee")
        VALUES ($1, $2, $3, $4, NOW(), NULL, NULL)
    `,
		[customerId, gameId, daysRented, originalPrice]
	);
}

async function returnRental(rentalId, delayFee = null) {
	await connection.query(
		`
        UPDATE rentals
        SET "returnDate" = NOW(), "delayFee" = $1
        WHERE id = $2
    `,
		[delayFee, rentalId]
	);
}

async function deleteRental(rentalId) {
	await connection.query(`DELETE FROM rentals WHERE id = $1`, [rentalId]);
}

const rentalsRepositories = {
	getRentals,
	getRentalsByCustomer,
	getRentalsByGame,
	getRentalsByCustomerAndGame,
	getRentalById,
	getRentedGames,
	createRental,
	returnRental,
	deleteRental,
};

export default rentalsRepositories;
