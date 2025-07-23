import { Router } from 'express';
import rentalsController from '../controllers/rentalsController.js';
import validateSchema from '../middlewares/validateSchema.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', rentalsController.getRentals);
rentalsRouter.post('/rentals', validateSchema('rental'), rentalsController.createRental);
rentalsRouter.post('/rentals/:id/return', rentalsController.returnRental);
rentalsRouter.delete('/rentals/:id', rentalsController.deleteRental);

export default rentalsRouter;
