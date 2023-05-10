import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { SkinController } from "../controllers/skinController";
import { AppController } from "../controllers/appController";
const router = express.Router();

export const AppRoutes = () => {
  const skinController = new SkinController();
  const appController = new AppController();

  router.post("/decodetoken", authMiddleware, appController.decodedToken);
  router.post(
    "/check-transaction/:txHash",
    authMiddleware,
    appController.checkTransaction
  );
  router.post("/getavailableskins", skinController.findAvailableSkins);
  router.post("/top10", appController.getTop10ByRating);

  return router;
};
