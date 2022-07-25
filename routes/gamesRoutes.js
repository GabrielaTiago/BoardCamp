import { Router } from "express";

const gamesRoutes = Router();

gamesRoutes.get("/games/?name=");
gamesRoutes.post("/games");

export { gamesRoutes };
