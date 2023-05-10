"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const skinController_1 = require("../controllers/skinController");
const router = express_1.default.Router();
const AdminRoutes = () => {
    const skinController = new skinController_1.SkinController();
    router.post("/createskin", adminMiddleware_1.adminMiddleware, skinController.createSkin);
    return router;
};
exports.AdminRoutes = AdminRoutes;
