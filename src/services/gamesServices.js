import gamesRepositories from '../repositories/gamesRepositories.js';

async function getGames(name) {
	// If a name is provided, search for games by that name
	if (name) {
		const games = await gamesRepositories.getGameByName(name);
		if (!games || games.length === 0) {
			const error = { type: 'not_found', message: `No games found with the name: ${name}` };
			throw error;
		}
		return games;
	}
	// If no name is provided, return all games
	const allGames = await gamesRepositories.getGames();
	if (!allGames || allGames.length === 0) {
		const error = { type: 'not_found', message: 'No games found' };
		throw error;
	}
	return allGames;
}

async function getGameByName(name) {
	const games = await gamesRepositories.getGameByName(name);
	if (!games || games.length === 0) {
		const error = { type: 'not_found', message: `No games found with the name: ${name}` };
		throw error;
	}
	return games;
}

async function createGame(name, image, categoryId, stockTotal, pricePerDay) {
	const existingGame = await gamesRepositories.getGameByName(name);
	if (existingGame.length > 0) {
		const error = { type: 'conflict', message: 'Game with this name already exists' };
		throw error;
	}
	await gamesRepositories.createGame(name, image, categoryId, stockTotal, pricePerDay);
}

async function updateGame(gameId, name, image, categoryId, stockTotal, pricePerDay) {
	const existingGame = await gamesRepositories.getGameByName(name);
	if (existingGame.length > 0 && existingGame[0].id !== gameId) {
		const error = { type: 'conflict', message: 'Game with this name already exists' };
		throw error;
	}
	await gamesRepositories.updateGame(gameId, name, image, categoryId, stockTotal, pricePerDay);
}

async function deleteGame(gameId) {
	const existingGame = await gamesRepositories.getGameById(gameId);
	if (existingGame.length === 0) {
		const error = { type: 'not_found', message: 'Game not found' };
		throw error;
	}
	await gamesRepositories.deleteGame(gameId);
}

const gamesServices = {
	getGames,
	getGameByName,
	createGame,
	updateGame,
	deleteGame,
};

export default gamesServices;
