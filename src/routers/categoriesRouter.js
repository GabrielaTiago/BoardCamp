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
categoriesRouter.put('/categories', validateSchema('categoryUpdate'), updateCategoryController);
categoriesRouter.delete('/categories/:name', deleteCategoryController);

export default categoriesRouter;
