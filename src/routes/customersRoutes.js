import { Router } from "express";
import {
  newCustomer,
  getCustomerByID,
  getCustomers,
  updateCustomers,
} from "../controllers/customersController.js";

const customersRoutes = Router();

customersRoutes.get("/customers", getCustomers);
customersRoutes.get("/customers/:id", getCustomerByID);
customersRoutes.post("/customers", newCustomer);
customersRoutes.put("/customers", updateCustomers);

export { customersRoutes };
