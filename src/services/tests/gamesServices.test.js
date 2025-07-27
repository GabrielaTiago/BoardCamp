import gamesRepositories from '../../repositories/gamesRepositories.js';
import gamesServices from '../gamesServices.js';

jest.mock('../../repositories/gamesRepositories.js');

const GAME_ID_1 = 1;
const GAME_NAME_1 = 'Banco Imobiliario';
const NOT_EXISTING_GAME_ID = 999;

const GAME_1 = {
	id: 1,
	name: 'Banco Imobiliario',
	image: 'http://',
	categoryId: 1,
	stockTotal: 10,
	pricePerDay: 5.0,
};
const GAME_2 = {
	id: 2,
	name: 'Batalha Naval',
	image: 'http://',
	categoryId: 2,
	stockTotal: 5,
	pricePerDay: 7.5,
};

const GAME_3 = {
	id: 3,
	name: 'Jogo da Vida',
	image: 'http://',
	categoryId: 1,
	stockTotal: 8,
	pricePerDay: 6.0,
};

const GAMES = [GAME_1, GAME_2, GAME_3];

const CONFLICT_ERROR = { type: 'conflict', message: 'Game with this name already exists' };

describe('Games Service', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getGames', () => {
		it('should return a list of games', async () => {
			gamesRepositories.getGames.mockResolvedValue(GAMES);

			const result = await gamesServices.getGames();

			expect(result).toEqual(GAMES);
			expect(gamesRepositories.getGames).toHaveBeenCalledTimes(1);
		});

		it('should return a list of games filtered by name', async () => {
			const gameName = 'Ba';
			const filteredGames = GAMES.filter((game) => game.name.toLowerCase().includes(gameName.toLowerCase()));
			gamesRepositories.getGameByName.mockResolvedValue(filteredGames);

			const result = await gamesServices.getGames(gameName);

			expect(result).toEqual(filteredGames);
			expect(gamesRepositories.getGameByName).toHaveBeenCalledWith(gameName);
			expect(gamesRepositories.getGameByName).toHaveBeenCalledTimes(1);
		});

		it('should throw a not found error when no games are found', async () => {
			gamesRepositories.getGames.mockResolvedValue([]);
			const expectedError = { type: 'not_found', message: 'No games found' };

			await expect(gamesServices.getGames()).rejects.toEqual(expectedError);
			expect(gamesRepositories.getGames).toHaveBeenCalledTimes(1);
		});

		it('should throw a not found error when no games are found by name', async () => {
			const gameName = 'NonExistentGame';
			const expectedError = { type: 'not_found', message: `No games found with the name: ${gameName}` };

			gamesRepositories.getGameByName.mockResolvedValue([]);
			await expect(gamesServices.getGameByName(gameName)).rejects.toEqual(expectedError);

			expect(gamesRepositories.getGameByName).toHaveBeenCalledWith(gameName);
			expect(gamesRepositories.getGameByName).toHaveBeenCalledTimes(1);
		});
	});

	describe('getGameById', () => {
		it('should return a game by ID', async () => {
			gamesRepositories.getGameById.mockResolvedValue([GAME_1]);
			const result = await gamesServices.getGameById(GAME_ID_1);

			expect(result).toEqual([GAME_1]);
			expect(gamesRepositories.getGameById).toHaveBeenCalledWith(GAME_ID_1);
			expect(gamesRepositories.getGameById).toHaveBeenCalledTimes(1);
		});

		it('should throw a not found error when game by ID is not found', async () => {
			gamesRepositories.getGameById.mockResolvedValue([]);
			const expectedError = { type: 'not_found', message: `Game with ID ${NOT_EXISTING_GAME_ID} not found` };

			await expect(gamesServices.getGameById(NOT_EXISTING_GAME_ID)).rejects.toEqual(expectedError);

			expect(gamesRepositories.getGameById).toHaveBeenCalledWith(NOT_EXISTING_GAME_ID);
			expect(gamesRepositories.getGameById).toHaveBeenCalledTimes(1);
		});
	});

	describe('createGame', () => {
		it('should create a new game successfully', async () => {
			const newGameData = {
				name: 'New Game',
				image: 'http://newgame.jpg',
				categoryId: 1,
				stockTotal: 10,
				pricePerDay: 5.0,
			};

			gamesRepositories.getGameByName.mockResolvedValue([]);
			gamesRepositories.createGame.mockResolvedValue();
			await gamesServices.createGame(
				newGameData.name,
				newGameData.image,
				newGameData.categoryId,
				newGameData.stockTotal,
				newGameData.pricePerDay
			);

			expect(gamesRepositories.createGame).toHaveBeenCalledWith(
				newGameData.name,
				newGameData.image,
				newGameData.categoryId,
				newGameData.stockTotal,
				newGameData.pricePerDay
			);
			expect(gamesRepositories.createGame).toHaveBeenCalledTimes(1);
		});

		it('should throw a conflict error if the game name already exists', async () => {
			const existingGameName = 'Banco Imobiliario';

			gamesRepositories.getGameByName.mockResolvedValue([GAME_1]);

			await expect(
				gamesServices.createGame(existingGameName, GAME_1.image, GAME_1.categoryId, GAME_1.stockTotal, GAME_1.pricePerDay)
			).rejects.toEqual(CONFLICT_ERROR);
			expect(gamesRepositories.getGameByName).toHaveBeenCalledWith(existingGameName);
			expect(gamesRepositories.getGameByName).toHaveBeenCalledTimes(1);
			expect(gamesRepositories.createGame).not.toHaveBeenCalled();
		});
	});

	describe('updateGame', () => {
		it('should update a game successfully', async () => {
			const gameId = 1;
			const updatedGameData = {
				name: 'Updated Game',
				image: 'http://updatedgame.jpg',
				categoryId: 1,
				stockTotal: 15,
				pricePerDay: 6.0,
			};

            gamesRepositories.getGameByName.mockResolvedValue([]);
            gamesRepositories.getGameById.mockResolvedValue([GAME_1]);
			gamesRepositories.updateGame.mockResolvedValue();
			await gamesServices.updateGame(
				gameId,
				updatedGameData.name,
				updatedGameData.image,
				updatedGameData.categoryId,
				updatedGameData.stockTotal,
				updatedGameData.pricePerDay
			);

			expect(gamesRepositories.updateGame).toHaveBeenCalledWith(
				gameId,
				updatedGameData.name,
				updatedGameData.image,
				updatedGameData.categoryId,
				updatedGameData.stockTotal,
				updatedGameData.pricePerDay
			);
			expect(gamesRepositories.updateGame).toHaveBeenCalledTimes(1);
		});

		it('should throw a conflict error when updating a game with an existing name', async () => {
			const gameId = 2;
			const updatedGameData = {
				name: GAME_NAME_1, // This name already exists
				image: 'http://updatedgame.jpg',
				categoryId: 1,
				stockTotal: 15,
				pricePerDay: 6.0,
			};

			gamesRepositories.getGameByName.mockResolvedValue([GAME_1]);

			await expect(
				gamesServices.updateGame(
					gameId,
					updatedGameData.name,
					updatedGameData.image,
					updatedGameData.categoryId,
					updatedGameData.stockTotal,
					updatedGameData.pricePerDay
				)
			).rejects.toEqual(CONFLICT_ERROR);
			expect(gamesRepositories.getGameByName).toHaveBeenCalledWith(updatedGameData.name);
			expect(gamesRepositories.getGameByName).toHaveBeenCalledTimes(1);
			expect(gamesRepositories.updateGame).not.toHaveBeenCalled();
		});

		it('should throw a not found error when trying to update a non-existing game', async () => {
			const updatedGameData = {
				name: 'Updated Game',
				image: 'http://updatedgame.jpg',
				categoryId: 1,
				stockTotal: 15,
				pricePerDay: 6.0,
			};
			const expectedError = { type: 'not_found', message: `Game with ID ${NOT_EXISTING_GAME_ID} not found` };

			gamesRepositories.getGameByName.mockResolvedValue([]);
			gamesRepositories.getGameById.mockResolvedValue([]);

			await expect(
				gamesServices.updateGame(
					NOT_EXISTING_GAME_ID,
					updatedGameData.name,
					updatedGameData.image,
					updatedGameData.categoryId,
					updatedGameData.stockTotal,
					updatedGameData.pricePerDay
				)
			).rejects.toEqual(expectedError);
			expect(gamesRepositories.getGameById).toHaveBeenCalledWith(NOT_EXISTING_GAME_ID);
			expect(gamesRepositories.getGameById).toHaveBeenCalledTimes(1);
			expect(gamesRepositories.updateGame).not.toHaveBeenCalled();
		});
	});

	describe('deleteGame', () => {
		it('should delete a game successfully', async () => {
			gamesRepositories.getGameById.mockResolvedValue([GAME_1]);
			gamesRepositories.deleteGame.mockResolvedValue();
			await gamesServices.deleteGame(GAME_ID_1);

			expect(gamesRepositories.deleteGame).toHaveBeenCalledWith(GAME_ID_1);
			expect(gamesRepositories.deleteGame).toHaveBeenCalledTimes(1);
		});

		it('should throw a not found error when trying to delete a non-existing game', async () => {
			const expectedError = { type: 'not_found', message: 'Game not found' };

			gamesRepositories.getGameById.mockResolvedValue([]);
			await expect(gamesServices.deleteGame(NOT_EXISTING_GAME_ID)).rejects.toEqual(expectedError);

			expect(gamesRepositories.getGameById).toHaveBeenCalledWith(NOT_EXISTING_GAME_ID);
			expect(gamesRepositories.getGameById).toHaveBeenCalledTimes(1);
			expect(gamesRepositories.deleteGame).not.toHaveBeenCalled();
		});
	});
});
