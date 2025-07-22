import { getCustomerByID, getCustomers, newCustomer, updateCustomers } from '../controllers/customersController.js';

import { Router } from 'express';
import validateSchema from '../middlewares/validateSchema.js';

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomerByID);
customersRouter.post('/customers', validateSchema('customer'), newCustomer);
customersRouter.put('/customers/:id', validateSchema('customer'), updateCustomers);

export default customersRouter;
