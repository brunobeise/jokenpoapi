import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { UserController } from "../controllers/userController";
const router = express.Router();

export const UsersRoutes = () => {
  const userController = new UserController();
  router.post("/skins", userController.getSkins);
  router.post("/", userController.createUser);
  router.post("/login", userController.login);
  router.post(
    "/withdraw-request",
    authMiddleware,
    userController.withdrawJokens
  );
  router.post("/editavatar", authMiddleware, userController.editUserAvatar);
  router.post("/purchaseskin", userController.addSkinToUser);
  router.post("/changeskin", userController.changeselectedSkin);
  router.post("/confirm", authMiddleware, userController.confirmUser)
  return router;
};
