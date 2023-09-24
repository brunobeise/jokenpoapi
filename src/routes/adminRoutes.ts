import express from "express";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { SkinController } from "../controllers/skinController";
import { AuctionController } from "../controllers/auctionController";
const router = express.Router();

export const AdminRoutes = () => {
  const skinController = new SkinController()
  const auctionController = new AuctionController();
  router.post("/createskin", adminMiddleware, skinController.createSkin);
  router.post("/claimAuction", adminMiddleware, auctionController.claimAuction)

  return router;
};
