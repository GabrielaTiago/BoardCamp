import { Router } from 'express';
import categoriesRouter from './categoriesRouter.js';
import customersRouter from './customersRouter.js';
import gamesRouter from './gamesRouter.js';
import rentalsRouter from './rentalsRouter.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../swagger.json' assert { type: 'json' };

const router = Router();

router.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use(categoriesRouter);
router.use(customersRouter);
router.use(gamesRouter);
router.use(rentalsRouter);

export default router;
