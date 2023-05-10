import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { GameController } from "../controllers/gameController";
const router = express.Router();

export const GameRoutes = () => {
  const gamecontroller = new GameController();
  router.post("/findplay", gamecontroller.getOnlinePlay);
  router.post("/computergame", authMiddleware, gamecontroller.computerGame);

  return router;
};
