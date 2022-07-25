import { Router } from "express";

const customersRoutes = Router();

customersRoutes.get("/customers");
customersRoutes.post("/customers");

export { customersRoutes };
