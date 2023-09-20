import { Request, Response } from "express";
import AuctionRepository from "../repository/AuctionRepository";
import { validateToken } from "../utils/crypto";
import UserRepository from "../repository/UserRepository";

export class AuctionController {

    async getAuctions(req: Request, res: Response) {
        const auctionRepository = new AuctionRepository()
        const auctions = await auctionRepository.getAll()
        return res.status(200).json(auctions)
    }

    async newBid(req: Request, res: Response) {
        const auctionRepository = new AuctionRepository()
        const userRepository = new UserRepository()
        const { auctionId, amount } = req.body
        if (!amount || !auctionId) return res.sendStatus(400)
        const token = req.headers.authorization!;
        const user = validateToken(token);
        if (!user) return res.sendStatus(402)
        const result = await auctionRepository.newBid(user.id, auctionId, amount)
        if (!result) return res.sendStatus(400)
        const newBalance = await userRepository.DepositJokens(user.id, amount * -1)
        const bids = await auctionRepository.getBidsByAuction(auctionId)
        return res.status(200).json({ newBalance, bids, auctionId })
    }

}