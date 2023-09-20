import express from "express"
import { AuctionController } from "../controllers/auctionController"

const router = express.Router()
const auctionController = new AuctionController()
export const AuctionRoutes = () => {
    router.get("/", auctionController.getAuctions)
    router.post("/bid", auctionController.newBid)
    return router
}