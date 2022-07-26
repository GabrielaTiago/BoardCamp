import { Router } from "express";
import {
  createCustomer,
  getCustomerByID,
  getCustomers,
  updateCustomers,
} from "../controllers/customersController.js";

const customersRoutes = Router();

customersRoutes.get("/customers", getCustomers);
customersRoutes.get("/customers/:id", getCustomerByID);
customersRoutes.post("/customers", createCustomer);
customersRoutes.put("/customers", updateCustomers);

export { customersRoutes };
