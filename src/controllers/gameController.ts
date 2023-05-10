import { Request, Response } from "express";
import sortResult from "../utils/sort";
import { checkResult } from "../utils/rules";
import { validateToken } from "../utils/crypto";
import UserRepository from "../repository/User.repository";
import { conectedUsers } from "../services/socket/socket";
import { newRatingCalculator } from "../utils/rating";

export class GameController {
  async computerGame(req: Request, res: Response) {
    const userRepository = new UserRepository();
    const valide = validateToken(req.headers.authorization!);
    if (!valide) return;
    const user = await userRepository.getUserById(valide.id);
    if (!user) return;
    const { playerHand, betValue } = req.body;
    const computerHand = sortResult();
    const result = checkResult(playerHand, computerHand);
    if (result === "win") {
      userRepository.addWin(user.id);
      userRepository.addMatch(user.id, betValue);
      const newRating = newRatingCalculator(user.rating!, user.rating!, true);
      userRepository.editRating(user.id, newRating);
    }
    if (result === "loss") {
      userRepository.addMatch(user.id, betValue * -1);
      const newRating = newRatingCalculator(user.rating!, user.rating!, false);
      userRepository.editRating(user.id, newRating);
    }
    if (result === "tie") {
      userRepository.addMatch(user.id, 0);
    }
    const resultJson = {
      playerHand: playerHand,
      computerHand: computerHand,
      result: result,
      betValue: betValue,
    };

    res.json(resultJson);
  }

  getOnlinePlay(req: Request, res: Response) {
    let roomIds: string[] = [];
    const prefix = req.body.prefix;
    conectedUsers.forEach((user) => roomIds.push(user.roomId));
    if (roomIds.length === 0) {
      res.json("-1");
      return;
    }

    let foundRoomId = "-1";
    roomIds = roomIds.filter((roomId) => roomId.startsWith(`@${prefix}`));
    roomIds.forEach((roomId) => {
      const filter = conectedUsers.filter((user) => user.roomId === roomId);
      if (filter.length === 1) {
        foundRoomId = roomId;
        return;
      }
    });

    res.json(foundRoomId);
  }
}
