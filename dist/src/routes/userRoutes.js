"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
const UsersRoutes = () => {
    const userController = new userController_1.UserController();
    router.post("/skins", userController.getSkins);
    router.post("/", userController.createUser);
    router.post("/login", userController.login);
    router.post("/withdraw-request", authMiddleware_1.authMiddleware, userController.withdrawJokens);
    router.post("/editavatar", authMiddleware_1.authMiddleware, userController.editUserAvatar);
    router.post("/purchaseskin", userController.addSkinToUser);
    router.post("/changeskin", userController.changeselectedSkin);
    return router;
};
exports.UsersRoutes = UsersRoutes;
