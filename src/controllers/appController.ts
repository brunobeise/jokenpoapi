import { NextFunction, Request, Response } from "express";
import { validateToken } from "../utils/crypto";
import { monitoringByHash } from "../services/metamask";
import UserRepository from "../repository/UserRepository";
import { sendEmail } from "../services/nodemailer";
import { connecteds } from "../services/socket/socket";

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
    const detail = await userData?.toDetail()
    res.json({ user: detail, connecteds: connecteds.length, });
  }

  async checkTransaction(req: Request, res: Response) {
    const userRepository = new UserRepository();
    const token = req.headers.authorization;
    let result = await monitoringByHash(req.params.txHash);
    let attempts = 0; // Contador para o número de tentativas

    // Validação do token antes de entrar no loop
    if (!token) {
      res.status(401).json("Token not found");
      return;
    }

    const decoded = validateToken(token);
    if (!decoded) {
      res.status(401).json("Token not found");
      return;
    }

    while (result === "Aguardando..." && attempts < 10) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      result = await monitoringByHash(req.params.txHash);
      console.log(result);
      attempts++;
    }


    if (result === "Aguardando..." || !result) {
      res.status(400).json({ success: false })

    }

    if (result) {
      userRepository.DepositJokens(decoded.id, req.body.value);
      res.status(200).json({ success: true })
    }
  }

  async sendEmail(req: Request, res: Response) {

    sendEmail(req.body.email, req.body.code)
      .then(r => res.status(200).json({
        success: true, data: {
          email: req.body.email, wallet: req.body.wallet
        }
      }))
      .catch(err => res.status(500).json({ success: false, error: err.message }))

  }


  async getTop10ByRating(req: Request, res: Response) {
    const userRepository = new UserRepository();
    const list = await userRepository.getTop10ByRating();
    res.status(200).json(list);
  }
}
