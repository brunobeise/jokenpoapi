import express from "express";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { SkinController } from "../controllers/skinController";
const router = express.Router();

export const AdminRoutes = () => {
  const skinController = new SkinController();
  router.post("/createskin", adminMiddleware, skinController.createSkin);

  return router;
};
