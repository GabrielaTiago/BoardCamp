import {
	createCategoryController,
	deleteCategoryController,
	getCategoriesController,
	updateCategoryController,
} from '../controllers/categoriesController.js';

import { Router } from 'express';
import validateSchema from '../middlewares/validateSchema.js';

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategoriesController);
categoriesRouter.post('/categories', validateSchema('category'), createCategoryController);
categoriesRouter.put('/categories/:id', validateSchema('category'), updateCategoryController);
categoriesRouter.delete('/categories/:id', deleteCategoryController);

export default categoriesRouter;
