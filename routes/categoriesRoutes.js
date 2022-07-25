import { Router } from "express";

const categoriesRoutes = Router();

categoriesRoutes.get("/categories");
categoriesRoutes.post("/categories");

export default categoriesRoutes;
