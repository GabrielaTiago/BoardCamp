import { getGames, newGame } from '../controllers/gamesControllers.js';

import { Router } from 'express';
import validateSchema from '../middlewares/validateSchema.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post('/games', validateSchema('game'), newGame);

export default gamesRouter;
