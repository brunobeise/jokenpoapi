import express from 'express';
import { MarketplaceController } from '../controllers/marketplaceController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router()
const marketplaceController = new MarketplaceController()

export const MarketplaceRoutes = () => {
    router.post('/newEntry', authMiddleware, marketplaceController.newEntry)
    router.get('/', authMiddleware, marketplaceController.list)
    router.post('/buySkin', authMiddleware, marketplaceController.buySkin)
    router.post('/cancel', authMiddleware, marketplaceController.cancel)
    return router
}