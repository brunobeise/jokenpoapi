import { Request, Response } from "express";
import sortResult, { sortWinResult } from "../utils/sort";
import { checkResult } from "../utils/rules";
import { validateToken } from "../utils/crypto";
import UserRepository from "../repository/UserRepository";
import { newRatingCalculator } from "../utils/rating";
import { Play } from "../../types";
import AppRepository from "../repository/AppRepository";

export class GameController {


  async computerGame(req: Request, res: Response) {
    const appRepository = new AppRepository();
    const userRepository = new UserRepository();
    const valide = validateToken(req.headers.authorization!);

    if (!valide) {
      return res.sendStatus(401); // Unauthorized
    }

    const [user, botBalance] = await Promise.all([
      userRepository.getUserById(valide.id),
      appRepository.getBotBalance()
    ]);

    if (!user) {
      return res.sendStatus(404); // User not found
    }

    const { playerHand, betValue } = req.body;

    if (user.balance! < betValue || !playerHand || !betValue) {
      return res.sendStatus(400); // Bad Request
    }

    const computerHand = (botBalance - betValue) < 0 ? sortWinResult(playerHand) : sortResult();
    const result = checkResult(playerHand, computerHand);
    const isWin = result === "win";
    const balanceAdjust = isWin ? betValue : betValue * -1;

    let newBalance: number | undefined;
    let newRating: number;

    if (result === "tie") {
      newBalance = await userRepository.addMatch(user.id, 0)
      newRating = user.rating!; // O rating não muda no caso de empate
    } else {
      [newBalance, newRating] = await Promise.all([
        userRepository.addMatch(user.id, balanceAdjust),
        Promise.resolve(newRatingCalculator(user.rating!, user.rating!, isWin))
      ]);

      const updatePromises = [
        appRepository.updateBotBalance(balanceAdjust * -1),
        userRepository.editRating(user.id, newRating)
      ];

      if (isWin) {
        updatePromises.push(userRepository.addWin(user.id));
      }

      await Promise.all(updatePromises);
    }

    const resultJson = {
      playerHand,
      computerHand,
      result,
      betValue,
      newBalance,
      newRating
    };

    res.status(200).json(resultJson);
  }


}
