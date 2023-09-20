import { Request, Response } from "express";
import MarketplaceRepository from "../repository/MarketplaceRepository";
import { validateToken } from "../utils/crypto";
import UserRepository from "../repository/UserRepository";
import { User } from "../entity/UserEntity";

export class MarketplaceController {

    async newEntry(req: Request, res: Response) {
        const marketplaceRepository = new MarketplaceRepository()
        const userRepository = new UserRepository()
        const { value, skin } = req.body
        const token = req.headers.authorization!;
        const user = validateToken(token);
        if (!user || !value || !skin) return res.sendStatus(400)
        const entry = await marketplaceRepository.createMarketplaceEntry(user.id, skin, value)
        userRepository.changeSelectedSkin(user.id, '')
        const userAttSkins = await userRepository.getUserById(user.id)
        if (!entry) return res.sendStatus(400)
        return res.status(200).json({ newSkins: userAttSkins?.skins })
    }

    async list(req: Request, res: Response) {
        const marketplaceRepository = new MarketplaceRepository()
        const search = req.query.search as string
        const page = req.query.page as string
        const sort = req.query.sort as string
        const marketplaceList = await marketplaceRepository.findAll(search, page, sort)
        return res.status(200).json(marketplaceList)
    }

    async buySkin(req: Request, res: Response) {
        const userRepository = new UserRepository()
        const token = req.headers.authorization!
        const user = validateToken(token)
        const { marketplaceId } = req.body
        if (!user || !marketplaceId) return res.sendStatus(400)
        const marketplaceRepository = new MarketplaceRepository()
        const buy = await marketplaceRepository.buySkin(user.id, marketplaceId)
        if (!buy) return res.sendStatus(400)
        const newUser = await userRepository.getUserById(user.id)
        return res.status(200).json({ success: true, user: await newUser!.toDetail() })
    }

    async cancel(req: Request, res: Response) {
        const marketplaceRepository = new MarketplaceRepository()
        const userRepository = new UserRepository()
        const { marketplaceId } = req.body
        if (!marketplaceId) return res.sendStatus(400)
        const marketplace = await marketplaceRepository.findById(marketplaceId)
        if (!marketplace) return res.sendStatus(400)
        const token = req.headers.authorization!;
        const user = validateToken(token);
        if (!user) return res.sendStatus(400)
        console.log();

        const userMarket = marketplace.user as unknown as User
        if (userMarket.id !== user.id) return res.sendStatus(402)
        await marketplaceRepository.cancel(marketplace.id)
        const userAttSkins = await userRepository.getUserById(user.id)
        return res.status(200).json({ newSkins: userAttSkins?.skins })

    }
}