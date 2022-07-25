import { Router } from "express";
import { getCategories, newCategory } from "../controllers/categoriesController.js";
import { newCategoryMiddleware } from "../middlewares/newCategoryMiddleware.js";

const categoriesRoutes = Router();

categoriesRoutes.get("/categories", getCategories);
categoriesRoutes.post("/categories", newCategoryMiddleware, newCategory);

export default categoriesRoutes;
