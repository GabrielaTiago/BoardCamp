import { getGames, newGame } from '../controllers/gamesControllers.js';

import { Router } from 'express';
import { newGameMiddleware } from '../middlewares/newGameMiddleware.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post('/games', newGameMiddleware, newGame);

export default gamesRouter;
