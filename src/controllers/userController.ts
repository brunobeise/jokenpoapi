import { Request, Response } from "express";
import { database } from "../database";
import { User } from "../entity/UserEntity";
import bcrypt from "bcrypt";
import { generateToken, validateToken } from "../utils/crypto";
import { AvatarData } from "../../types";
import UserRepository from "../repository/UserRepository";
import SkinRepository from "../repository/SkinRepository";

export class UserController {


  async createUser(req: Request, res: Response) {

    const userRepository = new UserRepository();
    const { username, password, country, avatar } = req.body;

    if (!username || !password || !country || !avatar) return res.status(400).json({
      success: false,
      message: "Invalid parameters"
    })

    const usernames = await userRepository.getAllUsernames()

    if (usernames.some(u => u === username)) return res.status(400).json({
      success: false,
      message: "Username already exists"
    })

    const result = await userRepository.createUser(
      username,
      password,
      country,
      avatar
    );
    if (!result.data) return res.status(401).json({
      success: false,
      message: result.error
    })

    const token = generateToken(result.data.id, result.data.username);


    res.status(201).json({
      success: true,
      data: result,
      token: token
    });
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const userRepository = database.getRepository(User);
    console.log(username, password);

    const user = await userRepository.findOneBy({ username: username });
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid username or password. Please try again." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: "Invalid username or password. Please try again." });
      return;
    }

    const token = generateToken(user.id, user.username);

    res.json({
      success: true,
      data: await user.toDetail(),
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

    if (!skin) {
      res.status(400).json({ success: false });
      return;
    }

    const user = await userRepository.getUserById(req.body.id);

    if (!user) return;

    if (user.balance! < skin.price) {
      res.status(400).json({ success: false });
      return;
    }

    const result = await userRepository.addSkinToUser(
      req.body.id,
      req.body.skinName
    );

    if (!result) {
      res.status(400).json({ success: false });
      return;
    }

    userRepository.DepositJokens(user.id, skin.price * -1);
    res.status(200).json({ success: true });
  }

  async changeselectedSkin(req: Request, res: Response) {
    const userRepository = new UserRepository();
    await userRepository.changeSelectedSkin(req.body.id, req.body.skinName);
    res.sendStatus(201)
  }

  async confirmUser(req: Request, res: Response) {
    const { email, wallet } = req.body
    if (!email || !wallet) return res.sendStatus(400)
    const token = req.headers.authorization!;
    const user = validateToken(token);
    if (!user) return res.sendStatus(400)
    const userRepository = new UserRepository();
    const confirm = await userRepository.confirmUser(user.id, email, wallet)
    if (confirm) return res.sendStatus(200)
    else return res.sendStatus(400).json({ success: true, message: "email already registered" })
  }
}
