import { getCategories, newCategory } from '../controllers/categoriesController.js';

import { Router } from 'express';
import { newCategoryMiddleware } from '../middlewares/newCategoryMiddleware.js';

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories);
categoriesRouter.post('/categories', newCategoryMiddleware, newCategory);

export default categoriesRouter;
