import { Router } from "express";
import { getCategories, newCategory } from "../controllers/categoriesController.js";

const categoriesRoutes = Router();

categoriesRoutes.get("/categories", getCategories);
categoriesRoutes.post("/categories", newCategory);

export default categoriesRoutes;
