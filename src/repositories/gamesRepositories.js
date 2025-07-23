import { connection } from '../databases/postgres.js';

async function getGames() {
	const { rows: allGames } = await connection.query(`
        SELECT games.*, categories.name AS categoryName
        FROM games
        JOIN categories ON games."categoryId" = categories.id
    `);
	return allGames;
}

async function getGameByName(name) {
	const { rows: games } = await connection.query(
		`
        SELECT games.*, categories.name AS categoryName
        FROM games
        JOIN categories ON games."categoryId" = categories.id
        WHERE LOWER(games.name) LIKE LOWER($1)
    `,
		[`%${name}%`]
	);
	return games;
}

async function getGameById(gameId) {
	const { rows: game } = await connection.query(`SELECT * FROM games WHERE id = $1`, [gameId]);
	return game;
}

async function createGame(name, image, categoryId, stockTotal, pricePerDay) {
	await connection.query(
		`
        INSERT INTO games (name, image, "categoryId", "stockTotal", "pricePerDay")
        VALUES ($1, $2, $3, $4, $5)
    `,
		[name, image, categoryId, stockTotal, pricePerDay]
	);
}

async function updateGame(gameId, name, image, categoryId, stockTotal, pricePerDay) {
	await connection.query(
		`
        UPDATE games
        SET name = $1, image = $2, "categoryId" = $3, "stockTotal" = $4, "pricePerDay" = $5
        WHERE id = $6
    `,
		[name, image, categoryId, stockTotal, pricePerDay, gameId]
	);
}

async function deleteGame(gameId) {
	await connection.query(`DELETE FROM games WHERE id = $1`, [gameId]);
}

const gamesRepositories = {
	getGames,
	getGameByName,
	getGameById,
	createGame,
	updateGame,
	deleteGame,
};

export default gamesRepositories;
