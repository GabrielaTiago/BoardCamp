import { Router } from "express";
import {
  newCustomer,
  getCustomerByID,
  getCustomers,
  updateCustomers,
} from "../controllers/customersController.js";
import { newCustomerMiddleware } from "../middlewares/newCustomerMiddleware.js";

const customersRoutes = Router();

customersRoutes.get("/customers", getCustomers);
customersRoutes.get("/customers/:id", getCustomerByID);
customersRoutes.post("/customers", newCustomerMiddleware, newCustomer);
customersRoutes.put("/customers/:id", newCustomerMiddleware,updateCustomers);

export { customersRoutes };
