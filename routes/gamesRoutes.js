import { Router } from "express";
import { getGames, newGame } from "../controllers/gamesControllers.js";

const gamesRoutes = Router();

gamesRoutes.get("/games/?name=");
gamesRoutes.post("/games", newGame);

export { gamesRoutes };
