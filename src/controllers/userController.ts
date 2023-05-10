import { Request, Response } from "express";
import { database } from "../database";
import { User } from "../entity/User.entity";
import bcrypt from "bcrypt";
import { generateToken, validateToken } from "../utils/crypto";
import { AvatarData } from "../../types";
import UserRepository from "../repository/User.repository";
import SkinRepository from "../repository/Skin.Repository";

export class UserController {
  async createUser(req: Request, res: Response) {
    console.log(req.body);
    const userRepository = new UserRepository();
    const { username, password, country, avatar } = req.body;
    const result = await userRepository.createUser(
      username,
      password,
      country,
      avatar
    );
    res.json(result);
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const userRepository = database.getRepository(User);

    const user = await userRepository.findOneBy({ username: username });
    if (!user) {
      res.json({ success: false, user: {} });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.json({ succes: false, user: {} });
      return;
    }

    const token = generateToken(user.id, user.username);

    res.json({
      success: true,
      user: user,
      token: token,
    });
  }

  async getUsers(req: Request, res: Response) {
    const userRepository = new UserRepository();
    res.json(await userRepository.getUsers());
  }

  async withdrawJokens(req: Request, res: Response) {
    const userRepository = new UserRepository();
    const token = req.headers.authorization;
    if (!token || !req.body.value || req.body.wallet) {
      res.json("invalid parameters");
      return;
    }
    const user = await validateToken(token);
    if (!user) {
      res.json("user not found");
      return;
    }
    userRepository.DepositJokens(user.id, Number(req.body.value) * -1);
    userRepository.createWithdrawRequest(
      user.id,
      req.body.value,
      req.body.wallet
    );
    res.json("Withdraw request completed successfully");
  }

  async editUserAvatar(req: Request, res: Response) {
    const userRepository = new UserRepository();
    const avatar: AvatarData = req.body.avatar;
    const token = req.headers.authorization!;

    const user = validateToken(token);
    if (!user) {
      res.json("user not found");
      return;
    }
    userRepository.editAvatar(user.id, avatar);
    res.json(avatar);
  }

  async getSkins(req: Request, res: Response) {
    const userRepository = new UserRepository();
    const skins = await userRepository.getUserSkins(req.body.id);
    /* const skins = await userRepository.listUsersBySkinName(req.body.skinName); */
    res.json(skins);
  }

  async addSkinToUser(req: Request, res: Response) {
    const userRepository = new UserRepository();
    const skinRepository = new SkinRepository();
    const skin = await skinRepository.findSkinByName(req.body.name);

    if (!skin || skin.quantity === 0) {
      res.json({ result: false });
      return;
    }

    const user = await userRepository.getUserById(req.body.id);

    if (!user) return;

    if (user.balance! < skin.price) {
      res.json({ result: false });
      return;
    }

    const result = await userRepository.addUserSkin(
      req.body.id,
      req.body.skinName
    );

    if (!result) {
      res.json({ result: result });
      return;
    }

    skinRepository.adjustQuantity(req.body.name, -1);
    userRepository.DepositJokens(user.id, skin.price * -1);
    res.json({ result: true });
  }

  async changeselectedSkin(req: Request, res: Response) {
    const userRepository = new UserRepository();
    userRepository.changeSelectedSkin(req.body.id, req.body.skinName);
  }
}
