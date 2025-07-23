import { Router } from 'express';
import gamesController from '../controllers/gamesControllers.js';
import validateSchema from '../middlewares/validateSchema.js';

const gamesRouter = Router();

gamesRouter.get('/games', gamesController.getGames);
gamesRouter.post('/games', validateSchema('game'), gamesController.createGame);
gamesRouter.put('/games/:gameId', validateSchema('game'), gamesController.updateGame);
gamesRouter.delete('/games/:gameId', gamesController.deleteGame);

export default gamesRouter;
