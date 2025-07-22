import { getCustomerByID, getCustomers, newCustomer, updateCustomers } from '../controllers/customersController.js';

import { Router } from 'express';
import { newCustomerMiddleware } from '../middlewares/newCustomerMiddleware.js';

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomerByID);
customersRouter.post('/customers', newCustomerMiddleware, newCustomer);
customersRouter.put('/customers/:id', newCustomerMiddleware, updateCustomers);

export default customersRouter;
