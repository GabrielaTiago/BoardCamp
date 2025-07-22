import { getCategories, newCategory } from '../controllers/categoriesController.js';

import { Router } from 'express';
import validateSchema from '../middlewares/validateSchema.js';

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories);
categoriesRouter.post('/categories', validateSchema('category'), newCategory);

export default categoriesRouter;
