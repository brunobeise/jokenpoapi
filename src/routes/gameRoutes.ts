import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { GameController } from "../controllers/gameController";
const router = express.Router();

export const GameRoutes = () => {
  const gamecontroller = new GameController();
  router.post("/computer", authMiddleware, gamecontroller.computerGame);

  return router;
};
