"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const skinController_1 = require("../controllers/skinController");
const appController_1 = require("../controllers/appController");
const router = express_1.default.Router();
const AppRoutes = () => {
    const skinController = new skinController_1.SkinController();
    const appController = new appController_1.AppController();
    router.post("/decodetoken", authMiddleware_1.authMiddleware, appController.decodedToken);
    router.post("/check-transaction/:txHash", authMiddleware_1.authMiddleware, appController.checkTransaction);
    router.post("/getavailableskins", skinController.findAvailableSkins);
    router.post("/top10", appController.getTop10ByRating);
    return router;
};
exports.AppRoutes = AppRoutes;
