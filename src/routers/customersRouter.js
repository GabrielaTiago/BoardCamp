import { Router } from 'express';
import customersController from '../controllers/customersController.js';
import validateSchema from '../middlewares/validateSchema.js';

const customersRouter = Router();

customersRouter.get('/customers', customersController.getCustomers);
customersRouter.get('/customers/:id', customersController.getCustomerByID);
customersRouter.post('/customers', validateSchema('customer'), customersController.createCustomer);
customersRouter.put('/customers/:id', validateSchema('customer'), customersController.updateCustomer);
customersRouter.delete('/customers/:id', customersController.deleteCustomer);

export default customersRouter;
