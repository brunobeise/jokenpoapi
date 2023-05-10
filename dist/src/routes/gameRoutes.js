"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const gameController_1 = require("../controllers/gameController");
const router = express_1.default.Router();
const GameRoutes = () => {
    const gamecontroller = new gameController_1.GameController();
    router.post("/findplay", gamecontroller.getOnlinePlay);
    router.post("/computergame", authMiddleware_1.authMiddleware, gamecontroller.computerGame);
    return router;
};
exports.GameRoutes = GameRoutes;
