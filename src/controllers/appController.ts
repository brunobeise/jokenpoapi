import { NextFunction, Request, Response } from "express";
import { validateToken } from "../utils/crypto";
import { monitoringByHash } from "../services/metamask";
import UserRepository from "../repository/User.repository";

export class AppController {
  async decodedToken(req: Request, res: Response, next: NextFunction) {
    const userRepository = new UserRepository();
    if (!req.body.token) res.json("Token is required");
    const decoded = validateToken(req.body.token);
    if (!decoded) {
      res.json("Token is invalid");
      return;
    }
    const userData = await userRepository.getUserById(decoded.id);
    res.json(userData);
  }

  async checkTransaction(req: Request, res: Response) {
    const userRepository = new UserRepository();
    const token = req.headers.authorization;
    let result = await monitoringByHash(req.params.txHash);
    console.log(result);

    while (result === "Aguardando...") {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      result = await monitoringByHash(req.params.txHash);
      console.log(result);
    }

    if (result !== "Aguardando...") {
      res.json(result);
      if (!token) {
        res.json("Token not found");
        return;
      }
      const decoded = validateToken(token);
      if (!decoded) {
        res.json("Token not found");
        return;
      }
      userRepository.DepositJokens(decoded.id, req.body.value);
    }
  }

  async getTop10ByRating(req: Request, res: Response) {
    const userRepository = new UserRepository();
    const list = await userRepository.getTop10ByRating();
    res.json(list);
  }
}
