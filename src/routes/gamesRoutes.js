import { Router } from "express";
import { getGames, newGame } from "../controllers/gamesControllers.js";
import { newGameMiddleware } from "../middlewares/newGameMiddleware.js";

const gamesRoutes = Router();

gamesRoutes.get("/games/?name=", getGames);
gamesRoutes.post("/games", newGameMiddleware, newGame);

export { gamesRoutes };
