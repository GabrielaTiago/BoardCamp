import gamesServices from '../services/gamesServices.js';

async function getGames(req, res) {
	const { name } = req.query;
	const games = await gamesServices.getGames(name);
	res.status(200).send(games);
}

async function createGame(req, res) {
	const { name, image, categoryId, stockTotal, pricePerDay } = req.body;

	await gamesServices.createGame(name, image, categoryId, stockTotal, pricePerDay);
	res.status(201).send({ message: 'Game created successfully' });
}

async function updateGame(req, res) {
	const { gameId } = req.params;
	const { name, image, categoryId, stockTotal, pricePerDay } = req.body;
	await gamesServices.updateGame(gameId, name, image, categoryId, stockTotal, pricePerDay);
	res.status(200).send({ message: 'Game updated successfully' });
}

async function deleteGame(req, res) {
	const { gameId } = req.params;
	await gamesServices.deleteGame(gameId);
	res.status(200).send({ message: 'Game deleted successfully' });
}

const gamesControllers = {
	getGames,
	createGame,
	updateGame,
	deleteGame,
};

export default gamesControllers;
